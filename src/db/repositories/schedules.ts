import { getDatabase } from '../database';
import type { Schedule, CreateSchedule } from '../../types';

export async function getSchedulesBySubject(subjectId: number): Promise<Schedule[]> {
    const db = await getDatabase();
    return db.getAllAsync<Schedule>(
        'SELECT * FROM schedules WHERE subject_id = ? ORDER BY day_of_week, start_time',
        [subjectId]
    );
}

export async function getSchedulesByDay(dayOfWeek: number, semesterId: number): Promise<(Schedule & { subject_name: string; subject_color: string; professor: string | null })[]> {
    const db = await getDatabase();
    return db.getAllAsync(
        `SELECT s.*, sub.name as subject_name, sub.color as subject_color, sub.professor
     FROM schedules s
     JOIN subjects sub ON s.subject_id = sub.id
     WHERE s.day_of_week = ? AND sub.semester_id = ?
     ORDER BY s.start_time`,
        [dayOfWeek, semesterId]
    );
}

export async function createSchedule(data: CreateSchedule): Promise<number> {
    const db = await getDatabase();
    const result = await db.runAsync(
        'INSERT INTO schedules (subject_id, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?)',
        [data.subject_id, data.day_of_week, data.start_time, data.end_time]
    );
    return result.lastInsertRowId;
}

export async function deleteSchedulesBySubject(subjectId: number): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM schedules WHERE subject_id = ?', [subjectId]);
}

export async function deleteSchedule(id: number): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM schedules WHERE id = ?', [id]);
}
