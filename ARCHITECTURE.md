# Architecture

Next.js App Router serves the UI and Node.js route handlers in one deployable application. Drizzle models users, documents, and shares on SQLite. Local development stores a real SQLite file in `data/`; Vercel requires Turso's persistent SQLite-compatible libSQL service. The same schema and repository code use either URL.

Documents store Tiptap JSON serialized as SQLite TEXT so marks, headings, and lists survive reloads. The owner ID is always taken from a signed `jose` session cookie, never from request input. Passwords use bcrypt hashes. Every document read checks ownership or a share record; every write and share action requires ownership. Unsafe API requests check the request origin.

Text uploads are decoded as UTF-8 and converted into paragraph nodes before being inserted as ordinary documents. The editor waits about 800 ms after changes and sends one save at a time. A failed save keeps local edits and offers retry. API errors return plain messages without stack traces.

The integration suite uses a temporary SQLite database and real Next.js HTTP routes. The tradeoff of a compact single-app design is that concurrent editing and conflict resolution are deferred. Comments, version history, complex permissions, and PDF export are excluded to finish a reliable core within the assignment timebox. Another 2–4 hours would prioritize revision checks, share revocation, and browser tests.
