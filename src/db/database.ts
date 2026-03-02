import * as SQLite from 'expo-sqlite';
import { CREATE_TABLES_SQL, SEED_SETTINGS_SQL } from './schema';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
    if (db) return db;

    db = await SQLite.openDatabaseAsync('grade.db');

    // Enable WAL mode for better performance
    await db.execAsync('PRAGMA journal_mode = WAL;');
    await db.execAsync('PRAGMA foreign_keys = ON;');

    // Create tables
    await db.execAsync(CREATE_TABLES_SQL);

    // Seed default settings
    await db.execAsync(SEED_SETTINGS_SQL);

    return db;
}
