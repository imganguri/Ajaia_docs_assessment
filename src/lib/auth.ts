import 'server-only';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { AppError } from './core';
const cookieName = 'ajaia_session';
function key() { const secret = process.env.SESSION_SECRET; if (!secret || secret.length < 32) throw new Error('SESSION_SECRET must contain at least 32 characters'); return new TextEncoder().encode(secret); }
export async function setSession(userId: string) {
  const token = await new SignJWT({}).setProtectedHeader({ alg: 'HS256' }).setSubject(userId).setIssuedAt().setExpirationTime('7d').sign(key());
  (await cookies()).set(cookieName, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 });
}
export async function clearSession() { (await cookies()).delete(cookieName); }
export async function sessionId() {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token) throw new AppError(401, 'Not authenticated');
  try { const { payload } = await jwtVerify(token, key()); if (!payload.sub) throw new Error('Missing subject'); return payload.sub; }
  catch { throw new AppError(401, 'Not authenticated'); }
}
