-- Migration: Add sessions table (DB-backed auth sessions)
-- Date: 2026-02-09
-- Description: Persist login sessions across restarts and multi-process deployments.

CREATE TABLE IF NOT EXISTS sessions (
  token_hash VARCHAR(64) NOT NULL PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT sessions_ibfk_1 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_sessions_user_id (user_id),
  INDEX idx_sessions_expires_at (expires_at)
);

