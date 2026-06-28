PRAGMA foreign_keys = ON;

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  auth_subject TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE gateway_bindings (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  cloudflare_account_id TEXT NOT NULL,
  cloudflare_gateway_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(user_id, cloudflare_account_id, cloudflare_gateway_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE api_keys (
  id TEXT PRIMARY KEY,
  gateway_binding_id TEXT NOT NULL,
  name TEXT NOT NULL,
  key_prefix TEXT NOT NULL,
  key_hash TEXT UNIQUE NOT NULL,
  expires_at TEXT,
  revoked_at TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (gateway_binding_id) REFERENCES gateway_bindings(id) ON DELETE CASCADE
);

CREATE TABLE model_aliases (
  id TEXT PRIMARY KEY,
  gateway_binding_id TEXT NOT NULL,
  alias TEXT NOT NULL,
  target TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(gateway_binding_id, alias),
  FOREIGN KEY (gateway_binding_id) REFERENCES gateway_bindings(id) ON DELETE CASCADE
);

CREATE TABLE audit_events (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  metadata_json TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_gateway_bindings_user ON gateway_bindings(user_id);
CREATE INDEX idx_api_keys_gateway_binding ON api_keys(gateway_binding_id);
CREATE INDEX idx_audit_events_user_time ON audit_events(user_id, created_at DESC);
