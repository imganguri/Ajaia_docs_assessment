import { sessionId } from '@/lib/auth';
import { apiError, AppError, sameOrigin, textToDocument, titleSchema, validateUpload } from '@/lib/core';
import { createDocument } from '@/lib/documents';
export const runtime = 'nodejs';
export async function POST(request: Request) { try {
  sameOrigin(request);
  const userId = await sessionId();
  const form = await request.formData();
  const file = form.get('file');
  if (!(file instanceof File)) throw new AppError(400, 'Choose a text file');
  validateUpload(file);
  const bytes = await file.arrayBuffer();
  const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes).replace(/^\uFEFF/, '');
  if (!text.trim()) throw new AppError(400, 'File is empty');
  const title = titleSchema.parse(file.name.replace(/\.txt$/i, ''));
  return Response.json(await createDocument(userId, title, textToDocument(text)), { status: 201 });
} catch (error) { return apiError(error); } }
