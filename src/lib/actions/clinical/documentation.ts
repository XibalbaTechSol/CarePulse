
'use server'

import { db } from '../../db';
import { v4 as uuidv4 } from 'uuid';
import { clinicalAI } from '../../ai/services/clinical';

// Types
export interface ClinicalNoteInput {
    patientId: string;
    providerId: string;
    visitId?: string;
    type: string;
    content: string; // JSON string
    summary?: string;
}

export async function createClinicalNote(data: ClinicalNoteInput) {
    try {
        const id = uuidv4();
        const stmt = db.prepare(`
            INSERT INTO ClinicalNote (
                id, patientId, providerId, visitId, type, content, summary, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 'DRAFT')
        `);

        stmt.run(
            id,
            data.patientId,
            data.providerId,
            data.visitId || null,
            data.type,
            data.content,
            data.summary || null
        );

        return { success: true, id };
    } catch (error) {
        console.error('Error creating clinical note:', error);
        return { success: false, error: 'Failed to create note' };
    }
}

export async function updateClinicalNote(id: string, content: string, status: string = 'DRAFT') {
    try {
        const stmt = db.prepare(`
            UPDATE ClinicalNote 
            SET content = ?, status = ?, updatedAt = CURRENT_TIMESTAMP
            WHERE id = ?
        `);

        stmt.run(content, status, id);
        return { success: true };
    } catch (error) {
        console.error('Error updating note:', error);
        return { success: false, error: 'Failed to update note' };
    }
}

export async function getClinicalNotes(patientId: string) {
    try {
        const stmt = db.prepare(`
            SELECT * FROM ClinicalNote 
            WHERE patientId = ? 
            ORDER BY createdAt DESC
        `);
        return stmt.all(patientId);
    } catch (error) {
        console.error('Error fetching notes:', error);
        return [];
    }
}

export async function generateNoteFromTranscript(transcript: string, type: 'SOAP' | 'GENERAL' = 'SOAP') {
    try {
        if (type === 'SOAP') {
            const summary = await clinicalAI.summarizeEncounter({
                notes: [transcript]
            });
            return { success: true, note: summary };
        } else {
            const result = await clinicalAI.summarizeEncounter({ notes: [transcript] });
            return { success: true, note: { summary: result.summary } };
        }
    } catch (error) {
        console.error('Error generating note from transcript:', error);
        return { success: false, error: 'Failed to generate note' };
    }
}

export async function getClinicalNote(id: string) {
    const stmt = db.prepare('SELECT * FROM ClinicalNote WHERE id = ?');
    return stmt.get(id);
}
