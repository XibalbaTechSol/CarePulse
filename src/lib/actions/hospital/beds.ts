
'use server'

import { db } from '../../db';

export async function getBedStatus(organizationId: string) {
    try {
        const stmt = db.prepare(`
            SELECT * FROM HospitalBed 
            WHERE organizationId = ?
            ORDER BY ward, roomNumber
        `);
        // Mock data if empty
        const beds = stmt.all(organizationId);
        if (beds.length === 0) {
            return generateMockBeds(organizationId);
        }
        return beds;
    } catch (error) {
        console.error('Error fetching beds:', error);
        return [];
    }
}

export async function admitPatientToBed(bedId: string, patientId: string) {
    try {
        const stmt = db.prepare(`
            UPDATE HospitalBed 
            SET status = 'OCCUPIED', currentPatientId = ? 
            WHERE id = ?
        `);
        stmt.run(patientId, bedId);
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to admit' };
    }
}

export async function dischargePatient(bedId: string) {
    try {
        const stmt = db.prepare(`
            UPDATE HospitalBed 
            SET status = 'CLEANING', currentPatientId = NULL 
            WHERE id = ?
        `);
        stmt.run(bedId);
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to discharge' };
    }
}

function generateMockBeds(orgId: string) {
    // Generate some mock beds for visualization
    return [
        { id: '1', roomNumber: '101', bedNumber: 'A', ward: 'ICU', status: 'OCCUPIED', currentPatientId: 'p1' },
        { id: '2', roomNumber: '101', bedNumber: 'B', ward: 'ICU', status: 'AVAILABLE', currentPatientId: null },
        { id: '3', roomNumber: '201', bedNumber: 'A', ward: 'MedSurg', status: 'OCCUPIED', currentPatientId: 'p2' },
        { id: '4', roomNumber: '201', bedNumber: 'B', ward: 'MedSurg', status: 'CLEANING', currentPatientId: null },
        { id: '5', roomNumber: '202', bedNumber: 'A', ward: 'MedSurg', status: 'AVAILABLE', currentPatientId: null },
    ];
}
