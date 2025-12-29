
'use server'

import { db } from '../../db';

export async function getDeviceFleet(organizationId: string) {
    // Mock fleet data
    return [
        {
            id: '1',
            type: 'Infusion Pump',
            manufacturer: 'MedPump Corp',
            model: 'SmartInfuse 3000',
            status: 'ONLINE',
            location: 'ICU-04',
            lastMaintenance: '2025-01-15'
        },
        {
            id: '2',
            type: 'Ventilator',
            manufacturer: 'AirBreath Inc',
            model: 'RespireX 5',
            status: 'ONLINE',
            location: 'ICU-02',
            lastMaintenance: '2025-02-20'
        },
        {
            id: '3',
            type: 'Vital Monitor',
            manufacturer: 'HeartSense',
            model: 'VitaTrack Pro',
            status: 'OFFLINE',
            location: 'ED-Bay-1',
            lastMaintenance: '2024-12-10',
            alerts: ['Connection Lost']
        },
    ];
}

export async function getDeviceTelemetry(deviceId: string) {
    // Mock telemetry
    return {
        timestamp: new Date().toISOString(),
        metrics: {
            'Flow Rate': '125 mL/hr',
            'Volume Infused': '450 mL',
            'Battery': '85%'
        }
    };
}
