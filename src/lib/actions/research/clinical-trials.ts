
'use server'

import { db } from '../../db';

export async function getActiveTrials(organizationId: string) {
    // Mock trials data
    return [
        {
            id: '1',
            code: 'NCT04567891',
            name: 'Evaluating Efficacy of Novel Cardio-Protective Agent',
            phase: 'Phase III',
            status: 'RECRUITING',
            participants: 124,
            criterion: 'Patients with history of MI within 6 months, Age > 45'
        },
        {
            id: '2',
            code: 'NCT01234567',
            name: 'Long-term Outcomes of Robotic Surgery',
            phase: 'Observational',
            status: 'ACTIVE_NOT_RECRUITING',
            participants: 500,
            criterion: 'Prior robotic prostatectomy'
        },
    ];
}

export async function checkEligibility(trialId: string, patientId: string) {
    // Mock eligibility check
    // In a real app, this would query patient data against trial criteria
    const eligible = Math.random() > 0.3; // 70% chance eligible
    return {
        eligible,
        reason: eligible ? 'Patient meets all inclusion criteria.' : 'Exclusion criteria met: Recent surgery.'
    };
}
