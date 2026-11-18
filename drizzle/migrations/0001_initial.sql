CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, created_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS documents (id TEXT PRIMARY KEY NOT NULL, owner_id TEXT NOT NULL REFERENCES users(id), title TEXT NOT NULL, content_json TEXT NOT NULL, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS documents_owner_updated_idx ON documents(owner_id, updated_at);
CREATE TABLE IF NOT EXISTS document_shares (id TEXT PRIMARY KEY NOT NULL, document_id TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE, shared_with_user_id TEXT NOT NULL REFERENCES users(id), created_at INTEGER NOT NULL, UNIQUE(document_id, shared_with_user_id));
CREATE INDEX IF NOT EXISTS shares_user_idx ON document_shares(shared_with_user_id);
