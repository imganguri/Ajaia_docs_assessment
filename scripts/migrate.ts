import { createClient } from '@libsql/client';
import { readFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { config } from 'dotenv';
config({ path: '.env.local' });
const url = process.env.DATABASE_URL || 'file:./data/ajaia.db';
if (url.startsWith('file:')) mkdirSync(resolve('data'), { recursive: true });
const client = createClient({ url, authToken: process.env.DATABASE_AUTH_TOKEN || undefined });
await client.execute('PRAGMA foreign_keys = ON');
await client.execute('CREATE TABLE IF NOT EXISTS _migrations (name TEXT PRIMARY KEY NOT NULL)');
const name = '0001_initial';
const applied = await client.execute({ sql: 'SELECT name FROM _migrations WHERE name = ?', args: [name] });
if (!applied.rows.length) {
  const statements = readFileSync(resolve('drizzle/migrations/0001_initial.sql'), 'utf8').split(';').map(x => x.trim()).filter(Boolean);
  for (const sql of statements) await client.execute(sql);
  await client.execute({ sql: 'INSERT INTO _migrations (name) VALUES (?)', args: [name] });
}
console.log('Migrations applied');
client.close();
