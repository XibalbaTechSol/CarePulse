
'use server'

import { db } from '../../db';
import { v4 as uuidv4 } from 'uuid';

export interface ReferralInput {
    patientId: string;
    targetProviderId: string; // Could be external
    specialty: string;
    reason: string;
    urgency: 'ROUTINE' | 'URGENT' | 'EMERGENCY';
    notes?: string;
}

export async function createReferral(data: ReferralInput) {
    try {
        const id = uuidv4();
        // Insert into logical Referral table
        const stmt = db.prepare(`
            INSERT INTO Referral (
                id, patientId, targetProviderId, specialty, reason, 
                urgency, notes, status, createdAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 'SENT', CURRENT_TIMESTAMP)
        `);

        stmt.run(
            id,
            data.patientId,
            data.targetProviderId,
            data.specialty,
            data.reason,
            data.urgency,
            data.notes || null
        );

        return { success: true, id };
    } catch (error) {
        console.error('Error creating referral:', error);
        return { success: false, error: 'Failed to send referral' };
    }
}

export async function getReferrals(organizationId: string) {
    // Mock data for referrals
    return [
        {
            id: '1',
            patient: 'Alice Wonderland',
            specialty: 'Cardiology',
            provider: 'Dr. Heart',
            status: 'ACCEPTED',
            date: '2025-05-10',
            urgency: 'ROUTINE'
        },
        {
            id: '2',
            patient: 'Bob Builder',
            specialty: 'Orthopedics',
            provider: 'Dr. Bone',
            status: 'SENT',
            date: '2025-05-12',
            urgency: 'URGENT'
        },
    ];
}
