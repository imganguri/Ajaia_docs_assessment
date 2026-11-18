# Final engineering report

Project: `E:\Google Doc clone - Assessment`. Stack: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Tiptap 3, Drizzle ORM, libSQL SQLite, Zod, bcryptjs, jose, and Vitest.

Local data is stored in `data/ajaia.db` and excluded from the package. Migrations and demo user seeding completed. Sessions are signed and stored in HttpOnly cookies; protected routes validate them server-side. Document reads require ownership or a share record. Renaming, editing, and sharing require ownership. Unsafe requests check same-origin headers.

The editor stores structured Tiptap JSON, supports common formatting, and autosaves sequentially after roughly 800 ms. Text import accepts UTF-8 `.txt` up to 1 MB. Sharing grants Bob view access only.

Verification: 5/5 HTTP integration tests passed against a temporary SQLite database and running Next.js server. `npm run typecheck`, `npm run lint`, `npm run build`, `npm run db:migrate`, and `npm run db:seed` passed. The initial npm audit found test-runner advisories; updating Vitest to 5.1.1 resulted in an npm install audit with zero vulnerabilities. Browser interactions and restart persistence were not manually checked.

Deployment URL: NOT YET DEPLOYED. A Turso database URL/token and Vercel account access are required. The code accepts Turso libSQL environment variables; no production deployment is claimed. Demo users are Alice and Bob; configure `DEMO_USER_PASSWORD` and run the seed script. Video: NOT YET RECORDED.

Known limits: no simultaneous editing, comments, version history, share revocation, PDF export, or merge conflict handling. Another 2–4 hours would prioritize browser tests, revision-aware saves, share revocation, and an accessibility review. See `SUBMISSION.md` for the PASS / NOT VERIFIED checklist.
