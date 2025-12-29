
'use server'

import { db } from '../../db';

export async function getTelemetryData(patientId: string) {
    // Mock live telemetry
    return {
        heartRate: 72,
        rhythm: 'NSR',
        spo2: 98,
        bp: '120/80',
        alerts: [],
        ecgStrip: 'mock-svg-path-or-data'
    };
}

export async function getTwleveLeadOrders(organizationId: string) {
    // Mock list
    return [
        { id: '1', patient: 'Michael Scott', reason: 'Chest Pain', status: 'PENDING', priority: 'STAT', orderedAt: new Date().toISOString() },
        { id: '2', patient: 'Jim Halpert', reason: 'Pre-op', status: 'COMPLETED', priority: 'ROUTINE', orderedAt: new Date(Date.now() - 3600000).toISOString() },
    ];
}
