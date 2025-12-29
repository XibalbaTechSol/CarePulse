
'use server'

import { db } from '../../db';
import { v4 as uuidv4 } from 'uuid';

export interface ClaimInput {
    patientId: string;
    payerId: string;
    amount: number;
    diagnosisCodes: string[];
    procedureCodes: string[];
    serviceDate: string;
}

export async function createClaim(data: ClaimInput) {
    try {
        const id = uuidv4();
        // Insert into mock/logical table
        const stmt = db.prepare(`
            INSERT INTO Claim (
                id, patientId, payerId, amount, status, serviceDate, 
                 diagnosisCodes, procedureCodes, submittedAt
            ) VALUES (?, ?, ?, ?, 'SUBMITTED', ?, ?, ?, CURRENT_TIMESTAMP)
        `);

        stmt.run(
            id,
            data.patientId,
            data.payerId,
            data.amount,
            data.serviceDate,
            JSON.stringify(data.diagnosisCodes),
            JSON.stringify(data.procedureCodes)
        );

        return { success: true, id };
    } catch (error) {
        console.error('Error creating claim:', error);
        return { success: false, error: 'Failed to submit claim' };
    }
}

export async function getClaimsAnalytics(organizationId: string) {
    // Mock analytics
    return {
        totalRevenue: 1250000,
        pendingClaims: 45,
        denials: 12,
        avgDaysToPayment: 24,
        recentClaims: [
            { id: '1', patient: 'John Doe', amount: 1200, status: 'PAID', date: '2025-05-01' },
            { id: '2', patient: 'Jane Smith', amount: 450, status: 'DENIED', date: '2025-05-02' },
            { id: '3', patient: 'Bob Jones', amount: 3200, status: 'PENDING', date: '2025-05-03' },
        ]
    };
}
