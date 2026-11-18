# Ajaia Docs — 5-minute walkthrough

## Before recording

Run `npm.cmd run dev` from the project folder and open `http://localhost:3000/login`. Have the Alice and Bob demo password ready. Prepare a small `notes.txt` file with the text below, with one blank line between paragraphs:

```text
Ajaia Docs helps teams capture ideas and keep their work organized.

This second paragraph was imported from a text file and can be edited like any other document.
```

Use a fresh document for the recording. If the application has not been deployed, record the local URL and describe Vercel deployment as pending. Do not show `.env.local`, session secrets, or database tokens on screen.

## 0:00–0:30 — Introduce the product

**On screen:** Show the login page and product name.

**Say:** “This is Ajaia Docs, a lightweight collaborative document workspace. A user can create and format documents, import a text file, and share a document with another user. Shared recipients can read the document, while the owner controls editing and sharing. The application is built with Next.js, React, TypeScript, Tiptap, and SQLite.”

## 0:30–1:30 — Create and format a document

**On screen:** Sign in as `alice@ajaia-demo.com`. In My Documents, click **New Document**. Rename it to **Project Plan**. Type a heading, two short paragraphs, and two list items. Select a few words and click **Bold**, *Italic*, and Underline. Apply Heading 1, Heading 2, a bulleted list, and a numbered list.

**Say:** “Alice is signed in using a seeded demo account. The dashboard separates documents she owns from documents shared with her. I’ll create a new document now. The title is editable because Alice owns it. The editor uses Tiptap, so formatting is stored as structured document JSON rather than plain text. These toolbar buttons apply real formatting to the current selection.”

## 1:30–2:00 — Show persistence

**On screen:** Pause until the status reads **Saved**. Refresh the editor. Confirm the title and formatting remain. Return to the dashboard and reopen **Project Plan**.

**Say:** “The editor waits briefly after changes and saves them through the backend. The status shows when the save completes. After refreshing and reopening, the title, content, headings, lists, and inline formatting are still present because they were stored in SQLite.”

## 2:00–2:30 — Import a text file

**On screen:** Return to the dashboard. Click **Upload .txt**, choose the prepared `notes.txt`, and show the two imported paragraphs. Add a sentence, then wait for **Saved**.

**Say:** “The import accepts UTF-8 `.txt` files up to 1 MB. The backend checks the file, converts its paragraphs into Tiptap JSON, and creates an ordinary editable document. The imported text can be formatted and saved in the same way as a document created in the app.”

## 2:30–3:30 — Share with Bob and show read-only access

**On screen:** Reopen **Project Plan**. Click **Share**, enter `bob@ajaia-demo.com`, and submit. Show Bob in the access list. Return to the dashboard, log out, and sign in as Bob. Click **Shared with Me**, open **Project Plan**, and show the **Read only** label. Try clicking the title or document body to demonstrate they cannot be edited.

**Say:** “Only the owner can share a document. Alice shares this one with Bob’s existing account. After switching accounts, Bob sees it under Shared with Me. He can read it, but the title and editor are read-only. This permission is checked by the server as well as reflected in the interface, so a direct update request from Bob is rejected.”

## 3:30–4:15 — Explain the architecture and security

**On screen:** Show `src/db/schema.ts`, `src/lib/documents.ts`, and the API route folders. Avoid opening secret files.

**Say:** “Next.js App Router serves the interface and Node.js API routes. Drizzle models users, documents, and sharing records. Locally, libSQL writes to a persistent SQLite file. On Vercel, the same database code is configured for Turso, which provides persistent SQLite-compatible storage. Passwords are stored as bcrypt hashes, and sign-in creates a signed session in an HttpOnly cookie. Every protected API request checks that session. Document reads require ownership or a share record; editing and sharing require ownership.”

## 4:15–5:00 — Tests, AI workflow, and limits

**On screen:** Show a terminal with the completed test output or run `npm.cmd test` after `npm.cmd run build`. Then show `AI_WORKFLOW.md` briefly.

**Say:** “The integration suite exercises the real HTTP API with a temporary SQLite database. It covers creation, rich-text persistence, private access, sharing, read-only restrictions, and text import. TypeScript checking, ESLint, and the production build also passed. Codex assisted with the initial implementation; the code was revised after errors and verified with these checks and local browser use. This version focuses on the core workflow. It does not include simultaneous editing, comments, version history, or PDF export. The next improvements would be revision-aware saves, share revocation, and broader browser tests. A public Vercel deployment and recorded video should only be listed in the submission after they are completed and verified.”
