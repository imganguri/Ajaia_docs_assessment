# Ajaia Docs

A collaborative document workspace with private documents, read-only sharing, rich-text editing, and text import. Built with Next.js App Router, React, TypeScript, Tailwind CSS, Tiptap, Drizzle ORM, and SQLite through libSQL.

## Local setup

Requires Node.js 20.9+ and npm.

```bash
npm install
cp .env.example .env.local
```

Set `SESSION_SECRET` to a random string of at least 32 characters and set `DEMO_USER_PASSWORD`. The local `DATABASE_URL=file:./data/ajaia.db` creates a persistent SQLite file. Then run:

```bash
npm run db:migrate
npm run db:seed
npm run dev
```

Open http://localhost:3000. Sign in as `alice@ajaia-demo.com` or `bob@ajaia-demo.com` with the password configured in `.env.local`. The seed script safely updates these accounts on repeat runs. The local `.env.local` is ignored by Git.

## Features

- Signed HttpOnly sessions and server-side route protection
- Owned and shared document lists, ordered by last edit
- Tiptap rich text: bold, italic, underline, headings, paragraphs, bullets, and numbered lists
- Debounced, sequential autosave with visible status and retry
- Owner-only rename and sharing; recipients are read-only
- UTF-8 `.txt` import up to 1 MB, with paragraph breaks preserved
- SQLite persistence with a repeatable migration and seeded demo users

## Checks

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

Run `npm run build` before `npm test`. The integration test starts the built Next.js server and uses a temporary SQLite file. It exercises the actual HTTP API. A production build is required before `npm start`.

## Deployment

Deploy the source to Vercel. Create a Turso database and set `DATABASE_URL=libsql://...`, `DATABASE_AUTH_TOKEN`, a random `SESSION_SECRET`, and `DEMO_USER_PASSWORD` in the Vercel project. With those same database variables in a local environment, run `npm run db:migrate` and `npm run db:seed` against Turso before deployment. Set the variables as Vercel environment variables, then deploy and verify both users' workflows. The app uses the same Drizzle schema and libSQL client for local and remote SQLite. Do not use a local file on Vercel, because its filesystem is ephemeral.

## Limitations and next steps

Sharing grants view access only. There is no simultaneous editing, comments, version history, PDF export, or account registration. The current editor saves the last accepted document state and does not merge concurrent owner tabs. Next improvements: revision-aware conflict detection, share revocation, keyboard shortcut hints, and browser end-to-end tests.
