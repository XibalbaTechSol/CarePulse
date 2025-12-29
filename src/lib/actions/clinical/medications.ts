
'use server'

import { db } from '../../db';
import { v4 as uuidv4 } from 'uuid';

export interface PrescriptionInput {
    patientId: string;
    medicationName: string;
    dosage: string;
    frequency: string;
    route: string;
    quantity: number;
    refills: number;
    providerId: string;
}

export async function createPrescription(data: PrescriptionInput) {
    try {
        const id = uuidv4();

        // Check for interactions (placeholder call)
        // const interactions = await clinicalReasoning.checkInteractions([data.medicationName]);

        const stmt = db.prepare(`
            INSERT INTO Prescription (
                id, patientId, providerId, medicationName, dosage, 
                frequency, route, quantity, refills, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')
        `);

        stmt.run(
            id,
            data.patientId,
            data.providerId,
            data.medicationName,
            data.dosage,
            data.frequency,
            data.route,
            data.quantity,
            data.refills
        );

        return { success: true, id };
    } catch (error) {
        console.error('Error creating prescription:', error);
        return { success: false, error: 'Failed to create prescription' };
    }
}

export async function getActiveMedications(patientId: string) {
    try {
        const stmt = db.prepare(`
            SELECT * FROM Prescription 
            WHERE patientId = ? AND status = 'ACTIVE'
            ORDER BY createdAt DESC
        `);
        return stmt.all(patientId);
    } catch (error) {
        console.error('Error fetching medications:', error);
        return [];
    }
}
