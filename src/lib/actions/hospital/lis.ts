
'use server'

import { db } from '../../db';
import { v4 as uuidv4 } from 'uuid';

export interface LabOrderInput {
    patientId: string;
    testCode: string; // e.g., 'CBC', 'BMP'
    testName: string;
    providerId: string;
    priority: 'ROUTINE' | 'STAT' | 'ASAP';
}

export async function createLabOrder(data: LabOrderInput) {
    try {
        const id = uuidv4();
        // Insert into mock/logical table
        const stmt = db.prepare(`
            INSERT INTO LabResult (
                id, patientId, testName, status, priority, orderDate
            ) VALUES (?, ?, ?, 'PENDING', ?, CURRENT_TIMESTAMP)
        `);

        stmt.run(
            id,
            data.patientId,
            data.testName,
            data.priority
        );

        return { success: true, id };
    } catch (error) {
        console.error('Error creating lab order:', error);
        return { success: false, error: 'Failed to order lab' };
    }
}

export async function getLabResults(patientId: string) {
    try {
        const stmt = db.prepare(`
            SELECT * FROM LabResult 
            WHERE patientId = ? 
            ORDER BY orderDate DESC
        `);
        const results = stmt.all(patientId);

        // Mock data
        if (results.length === 0) {
            return [
                { id: '1', testName: 'Complete Blood Count (CBC)', status: 'COMPLETED', result: 'WBC: 12.5 (High), Hgb: 14.1, Plt: 250', priority: 'ROUTINE', orderDate: new Date().toISOString() },
                { id: '2', testName: 'Basic Metabolic Panel (BMP)', status: 'PENDING', result: null, priority: 'STAT', orderDate: new Date().toISOString() },
            ];
        }
        return results;
    } catch (error) {
        return [];
    }
}
