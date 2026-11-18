import { redirect } from 'next/navigation';
import { db } from '@/db/client';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { sessionId } from '@/lib/auth';
import { listDocuments } from '@/lib/documents';
import { Dashboard } from '@/components/dashboard';
export const dynamic = 'force-dynamic';
export default async function DashboardPage() { let id: string; try { id = await sessionId(); } catch { redirect('/login'); } const user = (await db.select({ name: users.name, email: users.email }).from(users).where(eq(users.id, id)).limit(1))[0]; if (!user) redirect('/login'); const docs = await listDocuments(id); return <Dashboard user={user} initial={docs}/>; }
