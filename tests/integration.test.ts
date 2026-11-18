import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createClient, type Client } from '@libsql/client';
import { hash } from 'bcryptjs';
import { readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawn, type ChildProcess } from 'node:child_process';
import { createServer } from 'node:net';

const temp = mkdtempSync(join(tmpdir(), 'ajaia-test-'));
const databaseUrl = `file:${join(temp, 'test.db').replaceAll('\\', '/')}`;
let client: Client, server: ChildProcess, base: string, aliceCookie = '', bobCookie = '', outsiderCookie = '', documentId = '';
async function freePort(): Promise<number> { return new Promise((resolvePort, reject) => { const socket = createServer(); socket.once('error', reject); socket.listen(0, '127.0.0.1', () => { const address = socket.address(); if (!address || typeof address === 'string') return reject(new Error('No port')); socket.close(() => resolvePort(address.port)); }); }); }
async function request(path: string, method = 'GET', body?: unknown, cookie = '') {
  const headers: Record<string, string> = { origin: base, host: new URL(base).host };
  if (cookie) headers.cookie = cookie;
  if (body && !(body instanceof FormData)) headers['content-type'] = 'application/json';
  return fetch(base + path, { method, headers, body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined, redirect: 'manual' });
}
async function login(email: string) { const result = await request('/api/auth/login', 'POST', { email, password: 'TestPassword123!' }); expect(result.status).toBe(200); return result.headers.get('set-cookie')?.split(';')[0] || ''; }

beforeAll(async () => {
  client = createClient({ url: databaseUrl });
  await client.execute('PRAGMA foreign_keys = ON');
  for (const sql of readFileSync(resolve('drizzle/migrations/0001_initial.sql'), 'utf8').split(';').map(x => x.trim()).filter(Boolean)) await client.execute(sql);
  const passwordHash = await hash('TestPassword123!', 4);
  for (const name of ['Alice', 'Bob', 'Eve']) await client.execute({ sql: 'INSERT INTO users VALUES (?, ?, ?, ?, ?)', args: [name.toLowerCase(), name, `${name.toLowerCase()}@ajaia-demo.com`, passwordHash, Date.now()] });
  const port = await freePort(); base = `http://127.0.0.1:${port}`;
  server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', String(port)], { cwd: process.cwd(), env: { ...process.env, DATABASE_URL: databaseUrl, SESSION_SECRET: 'integration-test-secret-at-least-32-chars', NODE_ENV: 'production' }, stdio: 'ignore' });
  for (let i = 0; i < 90; i++) { try { const result = await fetch(base + '/login'); if (result.ok) break; } catch { /* starting */ } await new Promise(r => setTimeout(r, 500)); if (i === 89) throw new Error('Next server did not start'); }
  aliceCookie = await login('alice@ajaia-demo.com'); bobCookie = await login('bob@ajaia-demo.com'); outsiderCookie = await login('eve@ajaia-demo.com');
}, 90000);
afterAll(async () => { server?.kill(); client?.close(); try { rmSync(temp, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 }); } catch { /* Windows may hold the database briefly after process exit. */ } });

describe('document API with SQLite', () => {
  it('creates a document for the signed-in owner', async () => { const result = await request('/api/documents', 'POST', undefined, aliceCookie); expect(result.status).toBe(201); documentId = (await result.json()).id; expect(documentId).toBeTruthy(); });
  it('lets the owner view and update structured content', async () => {
    expect((await request(`/api/documents/${documentId}`, 'GET', undefined, aliceCookie)).status).toBe(200);
    const content = { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Bold text', marks: [{ type: 'bold' }] }] }] };
    expect((await request(`/api/documents/${documentId}`, 'PATCH', { title: 'Project notes', content }, aliceCookie)).status).toBe(200);
    const result = await request(`/api/documents/${documentId}`, 'GET', undefined, aliceCookie); expect((await result.json()).content).toEqual(content);
  });
  it('rejects private access and unauthorized sharing', async () => {
    expect((await request(`/api/documents/${documentId}`, 'GET', undefined, outsiderCookie)).status).toBe(404);
    expect((await request(`/api/documents/${documentId}/share`, 'POST', { email: 'eve@ajaia-demo.com' }, bobCookie)).status).toBe(404);
  });
  it('shares once with Bob and grants read-only access', async () => {
    expect((await request(`/api/documents/${documentId}/share`, 'POST', { email: 'bob@ajaia-demo.com' }, aliceCookie)).status).toBe(201);
    expect((await request(`/api/documents/${documentId}/share`, 'POST', { email: 'bob@ajaia-demo.com' }, aliceCookie)).status).toBe(409);
    expect((await request(`/api/documents/${documentId}`, 'GET', undefined, bobCookie)).status).toBe(200);
    expect((await request(`/api/documents/${documentId}`, 'PATCH', { title: 'Hijacked' }, bobCookie)).status).toBe(403);
    const list = await (await request('/api/documents', 'GET', undefined, bobCookie)).json(); expect(list.shared.some((d: { id: string }) => d.id === documentId)).toBe(true);
  });
  it('imports valid txt as editable paragraphs and rejects unsupported files', async () => {
    const valid = new FormData(); valid.set('file', new File(['First\n\nSecond'], 'notes.txt', { type: 'text/plain' }));
    const response = await request('/api/documents/import', 'POST', valid, aliceCookie); expect(response.status).toBe(201);
    const imported = await (await request(`/api/documents/${(await response.json()).id}`, 'GET', undefined, aliceCookie)).json();
    expect(imported.content.content).toHaveLength(2);
    const invalid = new FormData(); invalid.set('file', new File(['oops'], 'notes.pdf')); expect((await request('/api/documents/import', 'POST', invalid, aliceCookie)).status).toBe(400);
  });
});
