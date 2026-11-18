import 'server-only';
import { and, desc, eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { documents, documentShares, users } from '@/db/schema';
import { AppError, emptyDocument } from './core';
export async function listDocuments(userId: string) {
  const owned = await db.select({ id: documents.id, title: documents.title, updatedAt: documents.updatedAt, ownerName: users.name }).from(documents).innerJoin(users, eq(users.id, documents.ownerId)).where(eq(documents.ownerId, userId)).orderBy(desc(documents.updatedAt));
  const shared = await db.select({ id: documents.id, title: documents.title, updatedAt: documents.updatedAt, ownerName: users.name }).from(documentShares).innerJoin(documents, eq(documents.id, documentShares.documentId)).innerJoin(users, eq(users.id, documents.ownerId)).where(eq(documentShares.sharedWithUserId, userId)).orderBy(desc(documents.updatedAt));
  return { owned, shared: shared.filter(x => !owned.some(y => y.id === x.id)) };
}
export async function getDocument(id: string, userId: string) {
  const rows = await db.select().from(documents).where(eq(documents.id, id)).limit(1);
  const doc = rows[0];
  if (!doc) throw new AppError(404, 'Document unavailable');
  const isOwner = doc.ownerId === userId;
  if (!isOwner) {
    const share = await db.select({ id: documentShares.id }).from(documentShares).where(and(eq(documentShares.documentId, id), eq(documentShares.sharedWithUserId, userId))).limit(1);
    if (!share.length) throw new AppError(404, 'Document unavailable');
  }
  return { ...doc, content: JSON.parse(doc.contentJson), isOwner };
}
export async function requireOwner(id: string, userId: string) {
  const doc = await getDocument(id, userId);
  if (!doc.isOwner) throw new AppError(403, 'Only the owner can make this change');
  return doc;
}
export async function createDocument(userId: string, title = 'Untitled document', content: unknown = emptyDocument) {
  const id = crypto.randomUUID(), now = Date.now();
  await db.insert(documents).values({ id, ownerId: userId, title, contentJson: JSON.stringify(content), createdAt: now, updatedAt: now });
  return { id };
}
