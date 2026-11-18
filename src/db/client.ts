import 'server-only';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
const url = process.env.DATABASE_URL || 'file:./data/ajaia.db';
if (url.startsWith('file:')) mkdirSync(resolve(process.cwd(), 'data'), { recursive: true });
export const client = createClient({ url, authToken: process.env.DATABASE_AUTH_TOKEN || undefined });
export const db = drizzle(client);
