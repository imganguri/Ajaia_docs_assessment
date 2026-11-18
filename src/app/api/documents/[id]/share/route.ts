import { db } from '@/db/client';
import { documentShares, users } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { sessionId } from '@/lib/auth';
import { apiError, AppError, sameOrigin } from '@/lib/core';
import { requireOwner } from '@/lib/documents';
export const runtime = 'nodejs';
export async function POST(request: Request, context: { params: Promise<{ id: string }> }) { try {
  sameOrigin(request);
  const ownerId = await sessionId(), id = (await context.params).id;
  await requireOwner(id, ownerId);
  const { email } = z.object({ email: z.email() }).parse(await request.json());
  const user = (await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1))[0];
  if (!user) throw new AppError(404, 'No user has this email');
  if (user.id === ownerId) throw new AppError(400, 'You already own this document');
  const existing = await db.select().from(documentShares).where(and(eq(documentShares.documentId, id), eq(documentShares.sharedWithUserId, user.id))).limit(1);
  if (existing.length) throw new AppError(409, 'Already shared with this user');
  await db.insert(documentShares).values({ id: crypto.randomUUID(), documentId: id, sharedWithUserId: user.id, createdAt: Date.now() });
  return Response.json({ ok: true }, { status: 201 });
} catch (error) { return apiError(error); } }
