import { z } from 'zod';
export const emptyDocument = { type: 'doc', content: [{ type: 'paragraph' }] };
const node: z.ZodType<unknown> = z.lazy(() => z.object({ type: z.string(), attrs: z.record(z.string(), z.unknown()).optional(), text: z.string().optional(), marks: z.array(z.object({ type: z.string(), attrs: z.record(z.string(), z.unknown()).optional() })).optional(), content: z.array(node).optional() }).strict());
export const contentSchema = z.object({ type: z.literal('doc'), content: z.array(node).optional() }).strict();
export const titleSchema = z.string().trim().min(1).max(120);
export const patchSchema = z.object({ title: titleSchema.optional(), content: contentSchema.optional() }).refine(x => x.title !== undefined || x.content !== undefined);
export function textToDocument(text: string) {
  return { type: 'doc' as const, content: text.replace(/\r\n?/g, '\n').split(/\n\s*\n/).map(paragraph => ({ type: 'paragraph', content: paragraph ? [{ type: 'text', text: paragraph }] : undefined })) };
}
export function validateUpload(file: File) {
  if (!/\.txt$/i.test(file.name)) throw new AppError(400, 'Only .txt files are supported');
  if (file.size > 1024 * 1024) throw new AppError(400, 'File must be 1 MB or smaller');
  if (!file.size) throw new AppError(400, 'File is empty');
}
export class AppError extends Error { constructor(public status: number, message: string) { super(message); } }
export function apiError(error: unknown) {
  if (error instanceof AppError) return Response.json({ error: error.message }, { status: error.status });
  if (error instanceof z.ZodError) return Response.json({ error: 'Invalid input', issues: error.issues }, { status: 400 });
  console.error(error);
  return Response.json({ error: 'Unexpected server error' }, { status: 500 });
}
export function sameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (!origin || !host || new URL(origin).host !== host) throw new AppError(403, 'Invalid request origin');
}
