import { Database } from 'bun:sqlite';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database.sqlite');
const db = new Database(dbPath);

const users = db.prepare('SELECT id, username, email FROM users').all();
console.log(JSON.stringify(users, null, 2));
