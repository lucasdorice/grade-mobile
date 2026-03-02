import { getDatabase } from '../database';
import type { Subject, CreateSubject } from '../../types';

export async function getSubjectsBySemester(semesterId: number): Promise<Subject[]> {
    const db = await getDatabase();
    return db.getAllAsync<Subject>(
        'SELECT * FROM subjects WHERE semester_id = ? ORDER BY name',
        [semesterId]
    );
}

export async function getSubjectById(id: number): Promise<Subject | null> {
    const db = await getDatabase();
    return db.getFirstAsync<Subject>('SELECT * FROM subjects WHERE id = ?', [id]);
}

export async function createSubject(data: CreateSubject): Promise<number> {
    const db = await getDatabase();
    const result = await db.runAsync(
        'INSERT INTO subjects (semester_id, name, professor, color) VALUES (?, ?, ?, ?)',
        [data.semester_id, data.name, data.professor ?? null, data.color]
    );
    return result.lastInsertRowId;
}

export async function updateSubject(id: number, data: Partial<CreateSubject>): Promise<void> {
    const db = await getDatabase();
    const fields: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
    if (data.professor !== undefined) { fields.push('professor = ?'); values.push(data.professor); }
    if (data.color !== undefined) { fields.push('color = ?'); values.push(data.color); }

    if (fields.length === 0) return;
    values.push(id);
    await db.runAsync(`UPDATE subjects SET ${fields.join(', ')} WHERE id = ?`, values);
}

export async function deleteSubject(id: number): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM subjects WHERE id = ?', [id]);
}
