import { clearSession } from '@/lib/auth';
import { apiError, sameOrigin } from '@/lib/core';
export const runtime = 'nodejs';
export async function POST(request: Request) { try { sameOrigin(request); await clearSession(); return Response.json({ ok: true }); } catch (error) { return apiError(error); } }
