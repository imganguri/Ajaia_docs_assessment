import { redirect, notFound } from 'next/navigation';
import { sessionId } from '@/lib/auth';
import { getDocument } from '@/lib/documents';
import { AppError } from '@/lib/core';
import { DocumentEditor } from '@/components/editor';
export const dynamic = 'force-dynamic';
export default async function DocumentPage({ params }: { params: Promise<{ id: string }> }) { let id: string; try { id = await sessionId(); } catch { redirect('/login'); } let doc: Awaited<ReturnType<typeof getDocument>>; try { doc = await getDocument((await params).id, id); } catch (error) { if (error instanceof AppError && error.status === 404) notFound(); throw error; } return <DocumentEditor document={{ id: doc.id, title: doc.title, content: doc.content, isOwner: doc.isOwner }}/>; }
