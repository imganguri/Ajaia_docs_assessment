import { db } from '@/db/client';
import { documents } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { sessionId } from '@/lib/auth';
import { apiError, patchSchema, sameOrigin } from '@/lib/core';
import { getDocument, requireOwner } from '@/lib/documents';
export const runtime = 'nodejs';
type Context = { params: Promise<{ id: string }> };
export async function GET(_request: Request, context: Context) { try { return Response.json(await getDocument((await context.params).id, await sessionId())); } catch (error) { return apiError(error); } }
export async function PATCH(request: Request, context: Context) { try {
  sameOrigin(request);
  const id = (await context.params).id;
  await requireOwner(id, await sessionId());
  const input = patchSchema.parse(await request.json());
  await db.update(documents).set({ ...(input.title !== undefined ? { title: input.title } : {}), ...(input.content !== undefined ? { contentJson: JSON.stringify(input.content) } : {}), updatedAt: Date.now() }).where(eq(documents.id, id));
  return Response.json(await getDocument(id, await sessionId()));
} catch (error) { return apiError(error); } }
