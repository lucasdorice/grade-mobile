import { getDatabase } from '../database';
import type { Card, CreateCard } from '../../types';

export async function getOrCreateCard(subjectId: number, date: string): Promise<Card> {
    const db = await getDatabase();
    const existing = await db.getFirstAsync<Card>(
        'SELECT * FROM cards WHERE subject_id = ? AND date = ?',
        [subjectId, date]
    );
    if (existing) return existing;

    const result = await db.runAsync(
        'INSERT INTO cards (subject_id, date) VALUES (?, ?)',
        [subjectId, date]
    );
    return (await db.getFirstAsync<Card>('SELECT * FROM cards WHERE id = ?', [result.lastInsertRowId]))!;
}

export async function getCardById(id: number): Promise<Card | null> {
    const db = await getDatabase();
    return db.getFirstAsync<Card>('SELECT * FROM cards WHERE id = ?', [id]);
}

export async function getCardBySubjectAndDate(subjectId: number, date: string): Promise<Card | null> {
    const db = await getDatabase();
    return db.getFirstAsync<Card>(
        'SELECT * FROM cards WHERE subject_id = ? AND date = ?',
        [subjectId, date]
    );
}

export async function updateCardNotes(id: number, notes: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
        "UPDATE cards SET notes = ?, updated_at = datetime('now') WHERE id = ?",
        [notes, id]
    );
}

export async function deleteCard(id: number): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM cards WHERE id = ?', [id]);
}
