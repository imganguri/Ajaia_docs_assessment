# AI workflow

Codex assisted with the initial project structure, API routes, interface, integration tests, and documentation. The implementation was then reviewed and corrected during development. AI assistance was used for implementation guidance; working behavior was checked separately through commands and manual use.

The initial migration script needed an ESM configuration change. An ESLint error in the document page was fixed, and autosave was revised so a failed request keeps unsaved edits for retry. No AI suggestion was rejected outright; these suggestions were modified after verification.

Verification included SQLite migration and demo seeding, five HTTP integration tests, TypeScript checking, ESLint, and a production build. The user also reported that the local create, format, import, share, and read-only workflows worked in the browser. A recorded walkthrough and live deployment remain pending.
