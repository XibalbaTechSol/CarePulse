import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

let dbUrl = process.env.DATABASE_URL || 'carepulse.db';

console.log(`Raw DATABASE_URL: ${dbUrl}`);

// Clean up the URL
dbUrl = dbUrl.trim();
// Remove surrounding quotes FIRST
dbUrl = dbUrl.replace(/^["']|["']$/g, '');
dbUrl = dbUrl.trim();

// Remove 'file:' prefix
if (dbUrl.startsWith('file:')) {
    dbUrl = dbUrl.substring(5);
}

// If it looks like multiple env vars got mashed (e.g. missing newline in .env), try to extract up to .db
// This is a hack for the observed issue: "file:./dev.db"ENCRYPTION_KEY=...
if (dbUrl.includes('.db') && dbUrl.length > dbUrl.indexOf('.db') + 3) {
    const end = dbUrl.indexOf('.db') + 3;
    if (dbUrl.substring(end).includes('=')) {
        console.warn('Detected potentially malformed DATABASE_URL (mashed env vars). Truncating at .db');
        dbUrl = dbUrl.substring(0, end);
    }
}

const DB_PATH = path.isAbsolute(dbUrl) ? dbUrl : path.join(process.cwd(), dbUrl);

console.log(`Resolved Database path: ${DB_PATH}`);

export const db = new Database(DB_PATH);

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// Helper to init schema
export function initSchema() {
    const schemaPath = path.join(process.cwd(), 'src/lib/schema.sql');
    if (fs.existsSync(schemaPath)) {
        const schema = fs.readFileSync(schemaPath, 'utf-8');
        db.exec(schema);
        console.log('Database schema initialized.');
    } else {
        console.error('Schema file not found at:', schemaPath);
    }
}

// Helper generic types
export interface RunResult {
    changes: number;
    lastInsertRowid: number | bigint;
}

// Wrapper for easy query execution
export const sql = {
    // Get single row
    get: <T>(query: string, params: any[] = []): T | undefined => {
        return db.prepare(query).get(...params) as T | undefined;
    },
    // Get all rows
    all: <T>(query: string, params: any[] = []): T[] => {
        return db.prepare(query).all(...params) as T[];
    },
    // Run command (insert, update, delete)
    run: (query: string, params: any[] = []): RunResult => {
        return db.prepare(query).run(...params);
    },
    // Transaction wrapper
    transaction: <T>(fn: () => T): T => {
        return db.transaction(fn)();
    },
    // Generate ID
    id: () => uuidv4(),
    // Current ISO string
    now: () => new Date().toISOString()
};

// Initialize schema on first load if tables don't exist (basic check)
try {
    const tableCheck = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='User'").get();
    if (!tableCheck) {
        initSchema();
    }
} catch (e) {
    console.error("Error initializing DB:", e);
}

export default db;
