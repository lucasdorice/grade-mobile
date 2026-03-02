import { getDatabase } from '../database';
import type { Semester, CreateSemester } from '../../types';

export async function getAllSemesters(): Promise<Semester[]> {
    const db = await getDatabase();
    return db.getAllAsync<Semester>('SELECT * FROM semesters ORDER BY created_at DESC');
}

export async function getActiveSemester(): Promise<Semester | null> {
    const db = await getDatabase();
    return db.getFirstAsync<Semester>('SELECT * FROM semesters WHERE is_active = 1');
}

export async function createSemester(data: CreateSemester): Promise<number> {
    const db = await getDatabase();
    // Deactivate all other semesters
    await db.runAsync('UPDATE semesters SET is_active = 0');
    const result = await db.runAsync(
        'INSERT INTO semesters (name, start_date, end_date, is_active) VALUES (?, ?, ?, 1)',
        [data.name, data.start_date, data.end_date]
    );
    return result.lastInsertRowId;
}

export async function setActiveSemester(id: number): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('UPDATE semesters SET is_active = 0');
    await db.runAsync('UPDATE semesters SET is_active = 1 WHERE id = ?', [id]);
}

export async function deleteSemester(id: number): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM semesters WHERE id = ?', [id]);
}
