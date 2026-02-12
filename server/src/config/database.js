import { Database } from 'bun:sqlite';
import path from 'path';

const dbPath = path.join(import.meta.dir, '../../database.sqlite');
const db = new Database(dbPath);

// Initialize Database Schema
const initDb = () => {
  // Users Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      is_verified INTEGER DEFAULT 0,
      verification_token TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Files Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      filename TEXT NOT NULL,
      gcs_object_name TEXT NOT NULL,
      mime_type TEXT,
      size INTEGER,
      encryption_algo TEXT,
      encrypted_key TEXT,
      iv TEXT,
      ai_status TEXT DEFAULT 'Safe',
      upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // File Permissions Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS file_permissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      file_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      granted_by INTEGER NOT NULL,
      permission_type TEXT DEFAULT 'read',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (file_id) REFERENCES files(id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (granted_by) REFERENCES users(id),
      UNIQUE(file_id, user_id)
    )
  `);

  console.log('Database initialized');
};

initDb();

export default db;
