import { getDatabase } from './client';

// ==================== Types ====================

export interface Course {
    id: number;
    name: string;
    color: string;
    created_at: string;
}

export interface Schedule {
    id: number;
    course_id: number;
    day_of_week: number; // 0=Dom, 1=Seg, ..., 6=Sáb
    start_time: string;  // "08:00"
    end_time: string;    // "09:40"
}

export interface CourseWithSchedules extends Course {
    schedules: Schedule[];
}

export interface ClassSession {
    id: number;
    course_id: number;
    date: string;
    notes: string;
    created_at: string;
    updated_at: string;
}

export interface Task {
    id: number;
    class_session_id: number | null;
    course_id: number;
    description: string;
    due_date: string | null;
    is_completed: number; // 0 or 1
    created_at: string;
}

export interface TaskWithCourse extends Task {
    course_name: string;
    course_color: string;
}

export interface ClassSessionWithCourse extends ClassSession {
    course_name: string;
    course_color: string;
}

// ==================== App Config ====================

export async function getConfig(key: string): Promise<string | null> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<{ value: string }>(
        'SELECT value FROM app_config WHERE key = ?',
        [key]
    );
    return result?.value ?? null;
}

export async function setConfig(key: string, value: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
        'INSERT OR REPLACE INTO app_config (key, value) VALUES (?, ?)',
        [key, value]
    );
}

// ==================== Courses ====================

export async function getAllCourses(): Promise<Course[]> {
    const db = await getDatabase();
    return db.getAllAsync<Course>('SELECT * FROM courses ORDER BY name');
}

export async function getCourseById(id: number): Promise<Course | null> {
    const db = await getDatabase();
    return db.getFirstAsync<Course>('SELECT * FROM courses WHERE id = ?', [id]);
}

export async function createCourse(name: string, color: string): Promise<number> {
    const db = await getDatabase();
    const result = await db.runAsync(
        'INSERT INTO courses (name, color) VALUES (?, ?)',
        [name, color]
    );
    return result.lastInsertRowId;
}

export async function updateCourse(id: number, name: string, color: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
        'UPDATE courses SET name = ?, color = ? WHERE id = ?',
        [name, color, id]
    );
}

export async function deleteCourse(id: number): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM courses WHERE id = ?', [id]);
}

// ==================== Schedules ====================

export async function getSchedulesForCourse(courseId: number): Promise<Schedule[]> {
    const db = await getDatabase();
    return db.getAllAsync<Schedule>(
        'SELECT * FROM schedules WHERE course_id = ? ORDER BY day_of_week, start_time',
        [courseId]
    );
}

export async function getSchedulesForDay(dayOfWeek: number): Promise<(Schedule & { course_name: string; course_color: string })[]> {
    const db = await getDatabase();
    return db.getAllAsync(
        `SELECT s.*, c.name as course_name, c.color as course_color
     FROM schedules s
     JOIN courses c ON s.course_id = c.id
     WHERE s.day_of_week = ?
     ORDER BY s.start_time`,
        [dayOfWeek]
    );
}

export async function createSchedule(
    courseId: number,
    dayOfWeek: number,
    startTime: string,
    endTime: string
): Promise<number> {
    const db = await getDatabase();
    const result = await db.runAsync(
        'INSERT INTO schedules (course_id, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?)',
        [courseId, dayOfWeek, startTime, endTime]
    );
    return result.lastInsertRowId;
}

export async function deleteSchedulesForCourse(courseId: number): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM schedules WHERE course_id = ?', [courseId]);
}

// ==================== Class Sessions ====================

export async function getOrCreateSession(courseId: number, date: string): Promise<ClassSession> {
    const db = await getDatabase();

    // Try to find existing session
    const existing = await db.getFirstAsync<ClassSession>(
        'SELECT * FROM class_sessions WHERE course_id = ? AND date = ?',
        [courseId, date]
    );

    if (existing) return existing;

    // Create new session
    const result = await db.runAsync(
        'INSERT INTO class_sessions (course_id, date) VALUES (?, ?)',
        [courseId, date]
    );

    return {
        id: result.lastInsertRowId,
        course_id: courseId,
        date,
        notes: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };
}

export async function getSessionById(id: number): Promise<ClassSessionWithCourse | null> {
    const db = await getDatabase();
    return db.getFirstAsync<ClassSessionWithCourse>(
        `SELECT cs.*, c.name as course_name, c.color as course_color
     FROM class_sessions cs
     JOIN courses c ON cs.course_id = c.id
     WHERE cs.id = ?`,
        [id]
    );
}

export async function updateSessionNotes(id: number, notes: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
        "UPDATE class_sessions SET notes = ?, updated_at = datetime('now') WHERE id = ?",
        [notes, id]
    );
}

export async function getAllSessionsWithNotes(): Promise<ClassSessionWithCourse[]> {
    const db = await getDatabase();
    return db.getAllAsync<ClassSessionWithCourse>(
        `SELECT cs.*, c.name as course_name, c.color as course_color
     FROM class_sessions cs
     JOIN courses c ON cs.course_id = c.id
     WHERE cs.notes != ''
     ORDER BY cs.date DESC`
    );
}

export async function searchSessions(query: string): Promise<ClassSessionWithCourse[]> {
    const db = await getDatabase();
    return db.getAllAsync<ClassSessionWithCourse>(
        `SELECT cs.*, c.name as course_name, c.color as course_color
     FROM class_sessions cs
     JOIN courses c ON cs.course_id = c.id
     WHERE cs.notes LIKE ?
     ORDER BY cs.date DESC`,
        [`%${query}%`]
    );
}

export async function getSessionsForCourseId(courseId: number): Promise<ClassSessionWithCourse[]> {
    const db = await getDatabase();
    return db.getAllAsync<ClassSessionWithCourse>(
        `SELECT cs.*, c.name as course_name, c.color as course_color
     FROM class_sessions cs
     JOIN courses c ON cs.course_id = c.id
     WHERE cs.course_id = ?
     ORDER BY cs.date DESC`,
        [courseId]
    );
}

// Check if a session has notes (for badge on AulaCard)
export async function sessionHasNotes(courseId: number, date: string): Promise<boolean> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<{ notes: string }>(
        "SELECT notes FROM class_sessions WHERE course_id = ? AND date = ? AND notes != ''",
        [courseId, date]
    );
    return !!result;
}

// ==================== Tasks ====================

export async function getTasksForSession(sessionId: number): Promise<Task[]> {
    const db = await getDatabase();
    return db.getAllAsync<Task>(
        'SELECT * FROM tasks WHERE class_session_id = ? ORDER BY is_completed, created_at DESC',
        [sessionId]
    );
}

export async function getAllTasks(): Promise<TaskWithCourse[]> {
    const db = await getDatabase();
    return db.getAllAsync<TaskWithCourse>(
        `SELECT t.*, c.name as course_name, c.color as course_color
     FROM tasks t
     JOIN courses c ON t.course_id = c.id
     ORDER BY t.is_completed, t.due_date, t.created_at DESC`
    );
}

export async function getTasksForDate(date: string): Promise<TaskWithCourse[]> {
    const db = await getDatabase();
    return db.getAllAsync<TaskWithCourse>(
        `SELECT t.*, c.name as course_name, c.color as course_color
     FROM tasks t
     JOIN courses c ON t.course_id = c.id
     WHERE t.due_date = ?
     ORDER BY t.is_completed, t.created_at DESC`,
        [date]
    );
}

export async function getPendingTasksCount(): Promise<number> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM tasks WHERE is_completed = 0'
    );
    return result?.count ?? 0;
}

export async function getTaskDatesForMonth(year: number, month: number): Promise<{ due_date: string; is_completed: number; is_overdue: number }[]> {
    const db = await getDatabase();
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const today = new Date().toISOString().split('T')[0];

    return db.getAllAsync(
        `SELECT due_date, is_completed,
            CASE WHEN due_date < ? AND is_completed = 0 THEN 1 ELSE 0 END as is_overdue
     FROM tasks
     WHERE due_date >= ? AND due_date < ?
     ORDER BY due_date`,
        [today, startDate, endDate]
    );
}

export async function createTask(
    courseId: number,
    description: string,
    dueDate: string | null,
    sessionId: number | null
): Promise<number> {
    const db = await getDatabase();
    const result = await db.runAsync(
        'INSERT INTO tasks (course_id, description, due_date, class_session_id) VALUES (?, ?, ?, ?)',
        [courseId, description, dueDate, sessionId]
    );
    return result.lastInsertRowId;
}

export async function toggleTask(id: number): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
        'UPDATE tasks SET is_completed = CASE WHEN is_completed = 0 THEN 1 ELSE 0 END WHERE id = ?',
        [id]
    );
}

export async function deleteTask(id: number): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM tasks WHERE id = ?', [id]);
}
