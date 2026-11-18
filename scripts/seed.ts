import { createClient } from '@libsql/client';
import { hash } from 'bcryptjs';
import { config } from 'dotenv';
config({ path: '.env.local' });
const password = process.env.DEMO_USER_PASSWORD;
if (!password) throw new Error('Set DEMO_USER_PASSWORD in .env.local');
const client = createClient({ url: process.env.DATABASE_URL || 'file:./data/ajaia.db', authToken: process.env.DATABASE_AUTH_TOKEN || undefined });
const passwordHash = await hash(password, 12);
for (const [name, email] of [['Alice', 'alice@ajaia-demo.com'], ['Bob', 'bob@ajaia-demo.com']]) {
  await client.execute({ sql: 'INSERT INTO users (id, name, email, password_hash, created_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(email) DO UPDATE SET name = excluded.name, password_hash = excluded.password_hash', args: [crypto.randomUUID(), name, email, passwordHash, Date.now()] });
}
console.log('Demo users provisioned');
client.close();
