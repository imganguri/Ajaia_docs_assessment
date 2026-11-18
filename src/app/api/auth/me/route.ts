import { db } from '@/db/client';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { sessionId } from '@/lib/auth';
import { apiError, AppError } from '@/lib/core';
export const runtime = 'nodejs';
export async function GET() { try { const id = await sessionId(); const user = (await db.select({ name: users.name, email: users.email }).from(users).where(eq(users.id, id)).limit(1))[0]; if (!user) throw new AppError(401, 'Not authenticated'); return Response.json({ user }); } catch (error) { return apiError(error); } }
