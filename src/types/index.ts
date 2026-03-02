// ─── Entity Types ─── 

export interface Semester {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    is_active: number; // 0 or 1
    created_at: string;
}

export interface Subject {
    id: number;
    semester_id: number;
    name: string;
    professor: string | null;
    color: string;
    created_at: string;
}

export interface Schedule {
    id: number;
    subject_id: number;
    day_of_week: number; // 0=Sun, 1=Mon, ..., 6=Sat
    start_time: string;  // "08:00"
    end_time: string;    // "09:40"
}

export interface Card {
    id: number;
    subject_id: number;
    date: string;        // "2026-03-01"
    notes: string;
    created_at: string;
    updated_at: string;
}

export interface CodeSnippet {
    id: number;
    card_id: number;
    title: string;
    language: string;
    code: string;
    sort_order: number;
    created_at: string;
}

export interface Link {
    id: number;
    card_id: number;
    title: string;
    url: string;
    tag: string;
    created_at: string;
}

export interface Task {
    id: number;
    subject_id: number | null;
    title: string;
    due_date: string | null;
    is_done: number; // 0 or 1
    created_at: string;
    completed_at: string | null;
}

export interface Setting {
    key: string;
    value: string;
}

// ─── Input Types (for creating/updating) ───

export interface CreateSemester {
    name: string;
    start_date: string;
    end_date: string;
}

export interface CreateSubject {
    semester_id: number;
    name: string;
    professor?: string;
    color: string;
}

export interface CreateSchedule {
    subject_id: number;
    day_of_week: number;
    start_time: string;
    end_time: string;
}

export interface CreateCard {
    subject_id: number;
    date: string;
}

export interface CreateSnippet {
    card_id: number;
    title?: string;
    language: string;
    code: string;
}

export interface CreateLink {
    card_id: number;
    title: string;
    url: string;
    tag?: string;
}

export interface CreateTask {
    subject_id?: number;
    title: string;
    due_date?: string;
}

// ─── Augmented Types (for UI) ───

export interface SubjectWithSchedules extends Subject {
    schedules: Schedule[];
}

export interface TimelineItem {
    schedule: Schedule;
    subject: Subject;
    card: Card | null;
}
