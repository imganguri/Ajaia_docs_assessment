import { db } from '@/db/client';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { compare } from 'bcryptjs';
import { z } from 'zod';
import { setSession } from '@/lib/auth';
import { apiError, AppError, sameOrigin } from '@/lib/core';
export const runtime = 'nodejs';
export async function POST(request: Request) { try {
  sameOrigin(request);
  const { email, password } = z.object({ email: z.email(), password: z.string().min(1) }).parse(await request.json());
  const user = (await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1))[0];
  if (!user || !(await compare(password, user.passwordHash))) throw new AppError(401, 'Incorrect email or password');
  await setSession(user.id);
  return Response.json({ user: { name: user.name, email: user.email } });
} catch (error) { return apiError(error); } }
