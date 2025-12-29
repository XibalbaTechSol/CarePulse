
'use server'

import { db } from '../../db';

export interface TreatmentPlan {
    id: string;
    patientId: string;
    diagnosis: string;
    stage: string;
    protocol: string; // e.g. "R-CHOP"
    startDate: string;
    totalCycles: number;
    currentCycle: number;
    status: 'ACTIVE' | 'COMPLETED' | 'PAUSED';
}

export async function getTreatmentPlans(organizationId: string) {
    // Mock data
    return [
        {
            id: '1',
            patient: 'Jane Doe',
            diagnosis: 'Breast Cancer',
            stage: 'IIB',
            protocol: 'AC-T',
            startDate: '2025-01-10',
            totalCycles: 8,
            currentCycle: 3,
            status: 'ACTIVE',
            nextInfusion: '2025-05-24'
        },
        {
            id: '2',
            patient: 'John Smith',
            diagnosis: 'DLBCL',
            stage: 'III',
            protocol: 'R-CHOP',
            startDate: '2025-02-15',
            totalCycles: 6,
            currentCycle: 2,
            status: 'ACTIVE',
            nextInfusion: '2025-05-20'
        },
    ];
}

export async function logChemoAdmin(planId: string, cycle: number, notes: string) {
    // Logic to log administration
    return { success: true };
}
