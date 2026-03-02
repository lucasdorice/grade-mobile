import { getDatabase } from '../database';
import type { Link, CreateLink } from '../../types';

export async function getLinksByCard(cardId: number): Promise<Link[]> {
    const db = await getDatabase();
    return db.getAllAsync<Link>(
        'SELECT * FROM links WHERE card_id = ? ORDER BY created_at DESC',
        [cardId]
    );
}

export async function createLink(data: CreateLink): Promise<number> {
    const db = await getDatabase();
    const result = await db.runAsync(
        'INSERT INTO links (card_id, title, url, tag) VALUES (?, ?, ?, ?)',
        [data.card_id, data.title, data.url, data.tag ?? '']
    );
    return result.lastInsertRowId;
}

export async function updateLink(id: number, data: Partial<{ title: string; url: string; tag: string }>): Promise<void> {
    const db = await getDatabase();
    const fields: string[] = [];
    const values: any[] = [];

    if (data.title !== undefined) { fields.push('title = ?'); values.push(data.title); }
    if (data.url !== undefined) { fields.push('url = ?'); values.push(data.url); }
    if (data.tag !== undefined) { fields.push('tag = ?'); values.push(data.tag); }

    if (fields.length === 0) return;
    values.push(id);
    await db.runAsync(`UPDATE links SET ${fields.join(', ')} WHERE id = ?`, values);
}

export async function deleteLink(id: number): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM links WHERE id = ?', [id]);
}
