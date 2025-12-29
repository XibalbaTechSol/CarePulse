
'use server'

import { db } from '../../db';
import { v4 as uuidv4 } from 'uuid';

export interface CredentialInput {
    providerId: string;
    type: string; // 'LICENSE', 'DEA', 'BOARD_CERT'
    number: string;
    expirationDate: string;
    issuingState: string;
}

export async function addCredential(data: CredentialInput) {
    try {
        const id = uuidv4();
        // Logical table insert
        const stmt = db.prepare(`
            INSERT INTO Credential (
                id, providerId, type, number, expirationDate, 
                issuingState, status, verificationStatus
            ) VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE', 'PENDING')
        `);

        stmt.run(
            id,
            data.providerId,
            data.type,
            data.number,
            data.expirationDate,
            data.issuingState
        );

        return { success: true, id };
    } catch (error) {
        console.error('Error adding credential:', error);
        return { success: false, error: 'Failed' };
    }
}

export async function getProviderCredentials(providerId: string) {
    // Mock return
    return [
        { id: '1', type: 'State License', number: 'MD123456', state: 'NY', expires: '2026-12-31', status: 'VERIFIED' },
        { id: '2', type: 'DEA Registration', number: 'AB1234567', state: 'Federal', expires: '2025-06-30', status: 'EXPIRING_SOON' },
        { id: '3', type: 'Board Certification', number: 'IM-998877', state: 'ABIM', expires: '2030-01-01', status: 'VERIFIED' },
    ];
}
