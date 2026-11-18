# Submission

**Project:** Ajaia Docs — Collaborative Document Workspace  
**Source code:** This local project directory  
**Live deployment:** NOT YET DEPLOYED  
**Walkthrough:** NOT YET RECORDED

**Demo users:** Alice (`alice@ajaia-demo.com`) and Bob (`bob@ajaia-demo.com`). Configure `DEMO_USER_PASSWORD` in `.env.local`, then run the migration and seed scripts. Do not publish the password.

**Completed:** Authentication, owned/shared dashboard, create, rename, rich-text edit and autosave, `.txt` import, owner-only sharing, read-only recipient access, local SQLite migration and persistence.

**Partial:** Production deployment configuration is ready, but a Turso database, Vercel project, and verified URL require account access. Manual browser walkthrough remains to be recorded.

**Excluded:** Real-time collaboration, comments, version history, complex permissions, PDF export.

**Database:** Local SQLite file; Turso SQLite-compatible libSQL for production.  
**Documentation:** `README.md`, `ARCHITECTURE.md`, `AI_WORKFLOW.md`, `WALKTHROUGH_SCRIPT.md`.  
**Screenshots:** None captured.  
**Next 2–4 hours:** Browser tests, revision conflict handling, share revocation, accessibility review.

**Checks run:** Five HTTP integration tests passed. TypeScript, ESLint, production build, migration, and demo seeding passed. npm install audit reported zero vulnerabilities after the Vitest update. The duplicate local submission package was removed while preparing the project for Vercel. Browser walkthrough and remote deployment have not been verified.

## Definition of done

| Requirement | Status |
| --- | --- |
| Next.js starts locally | PASS — integration suite starts a Next.js server |
| SQLite initializes, migrates, and seeds Alice and Bob | PASS |
| Alice and Bob can log in | PASS — HTTP integration suite |
| Create, rename, save, and retrieve documents | PASS — HTTP integration suite |
| Rich-text toolbar works in browser | NOT VERIFIED — browser test pending |
| Rich-text formatting persists as JSON | PASS — HTTP integration suite |
| TXT import creates editable document | PASS — HTTP integration suite |
| Owner shares with Bob; Bob sees and reads it | PASS — HTTP integration suite |
| Bob cannot update; unrelated user cannot read | PASS — HTTP integration suite |
| Content survives application restart | NOT VERIFIED — SQLite file persists on disk, restart scenario pending |
| Automated tests, TypeScript, lint, build | PASS |
| Public deployment | NOT VERIFIED — credentials unavailable |
| Documentation | PASS |
| Google Drive submission package | NOT VERIFIED — local duplicate removed for Vercel cleanup |
| Video walkthrough | NOT VERIFIED — not recorded |
