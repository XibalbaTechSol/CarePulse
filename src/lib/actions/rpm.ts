
'use server'

import { db } from '../db';
import { v4 as uuidv4 } from 'uuid';

export interface DeviceReadingInput {
    patientId: string;
    deviceType: string;
    readingType: string;
    value: number;
    unit: string;
    deviceId: string;
}

export async function submitDeviceReading(data: DeviceReadingInput) {
    try {
        const id = uuidv4();
        const stmt = db.prepare(`
            INSERT INTO DeviceReading (
                id, patientId, deviceType, readingType, value, unit, deviceId
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
            id,
            data.patientId,
            data.deviceType,
            data.readingType,
            data.value,
            data.unit,
            data.deviceId
        );

        // Trigger alerts logic here if needed

        return { success: true, id };
    } catch (error) {
        console.error('Error saving device reading:', error);
        return { success: false, error: 'Failed to save reading' };
    }
}

export async function getRecentReadings(patientId: string, limit = 50) {
    try {
        const stmt = db.prepare(`
            SELECT * FROM DeviceReading 
            WHERE patientId = ? 
            ORDER BY recordedAt DESC 
            LIMIT ?
        `);
        return stmt.all(patientId, limit);
    } catch (error) {
        console.error('Error fetching readings:', error);
        return [];
    }
}
