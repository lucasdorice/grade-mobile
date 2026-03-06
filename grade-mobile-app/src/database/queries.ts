import { getDatabase } from './schema';

export interface Course {
    id: string;
    name: string;
    professor?: string;
    color_hex: string;
}

export interface Task {
    id: string;
    title: string;
    course_id?: string;
    due_date?: string;
    is_completed: boolean;
}

// Tarefa "Estendida" com os dados do curso da view
export interface TaskWithCourse extends Task {
    courseName?: string;
    courseColor?: string;
}

export async function fetchCourses(): Promise<Course[]> {
    const db = await getDatabase();
    const result = await db.getAllAsync<Course>('SELECT * FROM courses ORDER BY created_at ASC');
    return result;
}

export async function fetchTasks(): Promise<TaskWithCourse[]> {
    const db = await getDatabase();
    // Busca as tarefas fazendo um join com as disciplinas para obtermos cores e nomes
    const query = `
    SELECT 
      t.id, t.title, t.due_date, t.is_completed, t.course_id,
      c.name as courseName, c.color_hex as courseColor
    FROM tasks t
    LEFT JOIN courses c ON t.course_id = c.id
    ORDER BY t.due_date ASC, t.created_at DESC
  `;

    const results = await db.getAllAsync<any>(query);

    return results.map(row => ({
        id: row.id,
        title: row.title,
        due_date: row.due_date,
        is_completed: row.is_completed === 1,
        course_id: row.course_id,
        courseName: row.courseName,
        courseColor: row.courseColor,
    }));
}

export async function insertCourse(id: string, name: string, colorHex: string, professor?: string): Promise<void> {
    try {
        const db = await getDatabase();
        await db.runAsync(
            'INSERT OR REPLACE INTO courses (id, name, color_hex, professor) VALUES (?, ?, ?, ?)',
            [id, name, colorHex, professor || null]
        );
        console.log(`[DB] Curso ${name} inserido/atualizado com sucesso.`);
    } catch (error) {
        console.error('[DB] Falha ao inserir curso:', error);
        throw error;
    }
}

export async function insertClassSchedule(id: string, courseId: string, dayOfWeek: number, startTime: string, endTime: string): Promise<void> {
    try {
        const db = await getDatabase();
        await db.runAsync(
            'INSERT INTO class_schedules (id, course_id, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?, ?)',
            [id, courseId, dayOfWeek, startTime, endTime]
        );
    } catch (error) {
        console.error('[DB] Falha ao inserir schedule:', error);
        throw error;
    }
}

export async function insertTask(id: string, title: string, courseId?: string, dueDate?: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
        'INSERT INTO tasks (id, title, course_id, due_date, is_completed) VALUES (?, ?, ?, ?, 0)',
        [id, title, courseId || null, dueDate || null]
    );
}

export async function fetchClassesByDay(dayOfWeek: number): Promise<any[]> {
    const db = await getDatabase();

    // Busca apenas as aulas cujo agendamento bate com o dia passado (0 a 6)
    const query = `
    SELECT 
        c.id as courseId,
        c.name as courseName,
        c.color_hex as courseColor,
        s.id as scheduleId,
        s.start_time as startTime,
        s.end_time as endTime
    FROM class_schedules s
    INNER JOIN courses c ON s.course_id = c.id
    WHERE s.day_of_week = ?
    ORDER BY s.start_time ASC
  `;

    const schedules = await db.getAllAsync<any>(query, [dayOfWeek]);

    // Formatando para o componente de Cartão de Aula da Home
    return schedules.map((schedule, index) => ({
        id: schedule.scheduleId,
        courseId: schedule.courseId,
        courseName: schedule.courseName,
        courseColor: schedule.courseColor,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        title: 'Aula de ' + schedule.courseName,
        isActive: index === 0 // Deixar o primeiro cartão do dia ativo visualmente (ou baseado na hora atual no futuro)
    }));
}

export async function toggleTaskCompletion(taskId: string, isCompleted: boolean): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('UPDATE tasks SET is_completed = ? WHERE id = ?', [isCompleted ? 1 : 0, taskId]);
}

export async function clearDatabase() {
    const db = await getDatabase();
    await db.execAsync(`
        DELETE FROM tasks;
        DELETE FROM blocks;
        DELETE FROM class_cards;
        DELETE FROM class_schedules;
        DELETE FROM courses;
    `);
    console.log('[DB] Banco de dados limpo com sucesso.');
}

// === Queries da Tela de Aula (Anotações / Blocks) ===

export async function fetchCardForCourseAndDate(courseId: string, dateStr: string): Promise<any | null> {
    const db = await getDatabase();
    const result = await db.getFirstAsync('SELECT * FROM class_cards WHERE course_id = ? AND date = ?', [courseId, dateStr]);
    return result || null;
}

export async function insertClassCard(id: string, courseId: string, title: string, dateStr: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
        'INSERT INTO class_cards (id, course_id, title, date) VALUES (?, ?, ?, ?)',
        [id, courseId, title, dateStr]
    );
}

export async function fetchBlocksForCard(cardId: string): Promise<any[]> {
    const db = await getDatabase();
    const blocks = await db.getAllAsync('SELECT * FROM blocks WHERE card_id = ? ORDER BY order_index ASC', [cardId]);
    return blocks;
}

export async function saveBlocksForCard(cardId: string, blocks: any[]): Promise<void> {
    const db = await getDatabase();

    // Deleta os blocos antigos desse card e re-insere a nova ordem completa (Substituição Limpa)
    await db.runAsync('DELETE FROM blocks WHERE card_id = ?', [cardId]);

    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        await db.runAsync(
            'INSERT INTO blocks (id, card_id, type, content, order_index) VALUES (?, ?, ?, ?, ?)',
            [block.id, cardId, block.type, block.content, i]
        );
    }
}

export async function deleteCourse(courseId: string): Promise<void> {
    const db = await getDatabase();
    // Remove em cascata: blocos → cards → schedules → course
    await db.execAsync(`
        DELETE FROM blocks WHERE card_id IN (SELECT id FROM class_cards WHERE course_id = '${courseId}');
        DELETE FROM class_cards WHERE course_id = '${courseId}';
        DELETE FROM class_schedules WHERE course_id = '${courseId}';
        DELETE FROM tasks WHERE course_id = '${courseId}';
        DELETE FROM courses WHERE id = '${courseId}';
    `);
    console.log('[DB] Disciplina e dados associados removidos:', courseId);
}

export async function fetchAllNotes(): Promise<any[]> {
    const db = await getDatabase();
    const query = `
        SELECT 
            cc.id as cardId,
            cc.title as cardTitle,
            cc.date,
            c.name as courseName,
            c.color_hex as courseColor,
            c.id as courseId
        FROM class_cards cc
        INNER JOIN courses c ON cc.course_id = c.id
        ORDER BY cc.date DESC
    `;
    return await db.getAllAsync<any>(query);
}
