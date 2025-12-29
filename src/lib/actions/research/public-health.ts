
'use server'

import { db } from '../../db';

export async function getReportableEvents(organizationId: string) {
    // Mock reportable diseases
    return [
        {
            id: '1',
            disease: 'Tuberculosis',
            cases: 2,
            status: 'REPORT_PENDING',
            lastCaseDate: '2025-05-18'
        },
        {
            id: '2',
            disease: 'Gonorrhea',
            cases: 15,
            status: 'REPORTED',
            lastCaseDate: '2025-05-19'
        },
        {
            id: '3',
            disease: 'COVID-19',
            cases: 42,
            status: 'AUTO_REPORTING',
            lastCaseDate: '2025-05-20'
        },
    ];
}

export async function getOutbreakMapData() {
    // Mock geo data
    return [
        { zip: '90210', cases: 12, riskLevel: 'HIGH' },
        { zip: '90001', cases: 5, riskLevel: 'MODERATE' },
        { zip: '90404', cases: 1, riskLevel: 'LOW' },
    ];
}
