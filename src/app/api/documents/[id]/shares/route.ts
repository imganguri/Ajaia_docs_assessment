import { db } from '@/db/client';
import { documentShares, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { sessionId } from '@/lib/auth';
import { apiError } from '@/lib/core';
import { requireOwner } from '@/lib/documents';
export const runtime = 'nodejs';
export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) { try {
  const id = (await context.params).id;
  await requireOwner(id, await sessionId());
  const shares = await db.select({ name: users.name, email: users.email }).from(documentShares).innerJoin(users, eq(users.id, documentShares.sharedWithUserId)).where(eq(documentShares.documentId, id));
  return Response.json({ shares });
} catch (error) { return apiError(error); } }
