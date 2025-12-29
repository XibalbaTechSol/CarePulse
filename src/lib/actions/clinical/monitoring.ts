
'use server'

import { db } from '../../db';
import { deteriorationDetection, VitalsData } from '../../ai/services/deterioration-detection';
import { v4 as uuidv4 } from 'uuid';

export async function submitVitalSigns(patientId: string, vitals: VitalsData) {
    try {
        // Save vitals
        const vitalId = uuidv4();
        // Saving individually for brevity in this demo, usually loop
        // await db.prepare('INSERT ...').run(...)

        // Run Analysis
        const alert = await deteriorationDetection.analyzeVitals(patientId, vitals);

        if (alert) {
            // Save Alert
            const alertId = uuidv4();
            db.prepare(`
                INSERT INTO ClinicalAlert (
                    id, patientId, type, severity, score, message, status
                ) VALUES (?, ?, ?, ?, ?, ?, 'OPEN')
            `).run(
                alertId, patientId, alert.type, alert.riskLevel, alert.score, alert.message
            );

            return { success: true, alert };
        }

        return { success: true, alert: null };
    } catch (error) {
        console.error('Error submitting vitals:', error);
        return { success: false, error: 'Failed' };
    }
}
