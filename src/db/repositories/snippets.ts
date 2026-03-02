import { getDatabase } from '../database';
import type { CodeSnippet, CreateSnippet } from '../../types';

export async function getSnippetsByCard(cardId: number): Promise<CodeSnippet[]> {
    const db = await getDatabase();
    return db.getAllAsync<CodeSnippet>(
        'SELECT * FROM code_snippets WHERE card_id = ? ORDER BY sort_order, created_at',
        [cardId]
    );
}

export async function createSnippet(data: CreateSnippet): Promise<number> {
    const db = await getDatabase();
    const result = await db.runAsync(
        'INSERT INTO code_snippets (card_id, title, language, code) VALUES (?, ?, ?, ?)',
        [data.card_id, data.title ?? '', data.language, data.code]
    );
    return result.lastInsertRowId;
}

export async function updateSnippet(id: number, data: Partial<{ title: string; language: string; code: string }>): Promise<void> {
    const db = await getDatabase();
    const fields: string[] = [];
    const values: any[] = [];

    if (data.title !== undefined) { fields.push('title = ?'); values.push(data.title); }
    if (data.language !== undefined) { fields.push('language = ?'); values.push(data.language); }
    if (data.code !== undefined) { fields.push('code = ?'); values.push(data.code); }

    if (fields.length === 0) return;
    values.push(id);
    await db.runAsync(`UPDATE code_snippets SET ${fields.join(', ')} WHERE id = ?`, values);
}

export async function deleteSnippet(id: number): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM code_snippets WHERE id = ?', [id]);
}
