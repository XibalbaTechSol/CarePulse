
'use server'

import { db } from '../../db';
import { v4 as uuidv4 } from 'uuid';

export interface SurgeryBooking {
    patientId: string;
    procedureName: string;
    surgeonId: string;
    orRoom: string;
    scheduledTime: string;
    durationMinutes: number;
    priority: 'ROUTINE' | 'URGENT' | 'EMERGENCY';
}

export async function scheduleSurgery(data: SurgeryBooking) {
    try {
        const id = uuidv4();
        // Insert into logical table (mock)
        const stmt = db.prepare(`
            INSERT INTO SurgicalCase (
                id, patientId, procedureName, surgeonId, operatingRoomId, 
                scheduledStartTime, estimatedDuration, status, priority
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 'SCHEDULED', ?)
        `);

        stmt.run(
            id,
            data.patientId,
            data.procedureName,
            data.surgeonId,
            data.orRoom,
            data.scheduledTime,
            data.durationMinutes,
            data.priority
        );

        return { success: true, id };
    } catch (error) {
        console.error('Error scheduling surgery:', error);
        return { success: false, error: 'Failed to schedule' };
    }
}

export async function getORSule(date: string) {
    try {
        const stmt = db.prepare(`
            SELECT * FROM SurgicalCase 
            WHERE date(scheduledStartTime) = date(?)
            ORDER BY scheduledStartTime
        `);
        const cases = stmt.all(date);

        if (cases.length === 0) {
            return generateMockSchedule(date);
        }
        return cases;
    } catch (error) {
        return [];
    }
}

function generateMockSchedule(date: string) {
    return [
        { id: '1', procedureName: 'Appendectomy', orRoom: 'OR-1', scheduledStartTime: `${date}T08:00:00`, durationMinutes: 60, surgeon: 'Dr. Smith', status: 'IN_PROGRESS' },
        { id: '2', procedureName: 'Hip Replacement', orRoom: 'OR-2', scheduledStartTime: `${date}T09:00:00`, durationMinutes: 120, surgeon: 'Dr. Jones', status: 'SCHEDULED' },
        { id: '3', procedureName: 'C-Section', orRoom: 'OR-3', scheduledStartTime: `${date}T08:30:00`, durationMinutes: 60, surgeon: 'Dr. Doe', status: 'COMPLETED' },
    ];
}
