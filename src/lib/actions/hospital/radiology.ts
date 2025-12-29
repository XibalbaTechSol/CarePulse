
'use server'

import { db } from '../../db';
import { v4 as uuidv4 } from 'uuid';

export interface ImagingOrderInput {
    patientId: string;
    modality: 'X-RAY' | 'CT' | 'MRI' | 'ULTRASOUND';
    bodyPart: string;
    reason: string;
    providerId: string;
    priority: 'ROUTINE' | 'STAT';
}

export async function createImagingOrder(data: ImagingOrderInput) {
    try {
        const id = uuidv4();
        const stmt = db.prepare(`
            INSERT INTO RadiologyExam (
                id, patientId, modality, bodyPart, status, reason, priority, orderedAt
            ) VALUES (?, ?, ?, ?, 'SCHEDULED', ?, ?, CURRENT_TIMESTAMP)
        `);

        stmt.run(
            id,
            data.patientId,
            data.modality,
            data.bodyPart,
            data.reason,
            data.priority
        );
        return { success: true, id };
    } catch (error) {
        console.error('Error creating imaging order:', error);
        return { success: false, error: 'Failed to order imaging' };
    }
}

export async function getImagingExams(patientId: string) {
    try {
        const stmt = db.prepare(`
            SELECT * FROM RadiologyExam 
            WHERE patientId = ? 
            ORDER BY orderedAt DESC
        `);
        const exams = stmt.all(patientId);

        if (exams.length === 0) {
            return [
                { id: '1', modality: 'X-RAY', bodyPart: 'Chest', status: 'COMPLETED', reportUrl: '#', orderedAt: new Date().toISOString() },
                { id: '2', modality: 'MRI', bodyPart: 'Brain', status: 'SCHEDULED', reportUrl: null, orderedAt: new Date().toISOString() },
            ];
        }
        return exams;
    } catch (error) {
        return [];
    }
}
