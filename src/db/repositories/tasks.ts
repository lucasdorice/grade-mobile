import { getDatabase } from '../database';
import type { Task, CreateTask } from '../../types';

export async function getAllTasks(): Promise<(Task & { subject_name?: string; subject_color?: string })[]> {
    const db = await getDatabase();
    return db.getAllAsync(
        `SELECT t.*, s.name as subject_name, s.color as subject_color
     FROM tasks t
     LEFT JOIN subjects s ON t.subject_id = s.id
     ORDER BY t.is_done ASC, t.due_date ASC, t.created_at DESC`
    );
}

export async function getPendingTasks(): Promise<(Task & { subject_name?: string; subject_color?: string })[]> {
    const db = await getDatabase();
    return db.getAllAsync(
        `SELECT t.*, s.name as subject_name, s.color as subject_color
     FROM tasks t
     LEFT JOIN subjects s ON t.subject_id = s.id
     WHERE t.is_done = 0
     ORDER BY t.due_date ASC, t.created_at DESC`
    );
}

export async function createTask(data: CreateTask): Promise<number> {
    const db = await getDatabase();
    const result = await db.runAsync(
        'INSERT INTO tasks (subject_id, title, due_date) VALUES (?, ?, ?)',
        [data.subject_id ?? null, data.title, data.due_date ?? null]
    );
    return result.lastInsertRowId;
}

export async function toggleTask(id: number): Promise<void> {
    const db = await getDatabase();
    const task = await db.getFirstAsync<Task>('SELECT * FROM tasks WHERE id = ?', [id]);
    if (!task) return;

    if (task.is_done) {
        await db.runAsync('UPDATE tasks SET is_done = 0, completed_at = NULL WHERE id = ?', [id]);
    } else {
        await db.runAsync("UPDATE tasks SET is_done = 1, completed_at = datetime('now') WHERE id = ?", [id]);
    }
}

export async function updateTask(id: number, data: Partial<CreateTask>): Promise<void> {
    const db = await getDatabase();
    const fields: string[] = [];
    const values: any[] = [];

    if (data.title !== undefined) { fields.push('title = ?'); values.push(data.title); }
    if (data.subject_id !== undefined) { fields.push('subject_id = ?'); values.push(data.subject_id); }
    if (data.due_date !== undefined) { fields.push('due_date = ?'); values.push(data.due_date); }

    if (fields.length === 0) return;
    values.push(id);
    await db.runAsync(`UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`, values);
}

export async function deleteTask(id: number): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM tasks WHERE id = ?', [id]);
}
