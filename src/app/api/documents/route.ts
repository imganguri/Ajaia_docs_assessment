import { sessionId } from '@/lib/auth';
import { apiError, sameOrigin } from '@/lib/core';
import { createDocument, listDocuments } from '@/lib/documents';
export const runtime = 'nodejs';
export async function GET() { try { return Response.json(await listDocuments(await sessionId())); } catch (error) { return apiError(error); } }
export async function POST(request: Request) { try { sameOrigin(request); return Response.json(await createDocument(await sessionId()), { status: 201 }); } catch (error) { return apiError(error); } }
