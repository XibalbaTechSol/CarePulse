
'use server'

import { db } from '../../db';

export async function getPopulationMetrics(organizationId: string) {
    // Mock population health data
    return {
        totalPatients: 12500,
        riskStratification: [
            { level: 'High Risk', count: 450, color: '#bf616a' }, // Red
            { level: 'Rising Risk', count: 1200, color: '#ebcb8b' }, // Yellow
            { level: 'Low Risk', count: 10850, color: '#a3be8c' }, // Green
        ],
        careGaps: [
            { metric: 'A1c Screening', compliance: 72, target: 85 },
            { metric: 'Breast Cancer Screening', compliance: 68, target: 80 },
            { metric: 'BP Control', compliance: 65, target: 80 },
            { metric: 'Colorectal Screening', compliance: 55, target: 75 },
        ]
    };
}

export async function getHighRiskCohort() {
    return [
        { id: '1', name: 'Eleanor Shellstrop', conditions: ['Diabetes', 'CHF'], riskScore: 92, lastVisit: '2025-04-10' },
        { id: '2', name: 'Chidi Anagonye', conditions: ['Anxiety', 'Hypertension'], riskScore: 88, lastVisit: '2025-05-01' },
        { id: '3', name: 'Tahani Al-Jamil', conditions: ['Asthma'], riskScore: 45, lastVisit: '2025-02-14' },
    ];
}
