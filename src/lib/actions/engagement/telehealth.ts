
'use server'

import { db } from '../../db';

export async function getUpcomingVisits(organizationId: string) {
    // Mock visits
    const now = new Date();
    return [
        {
            id: '1',
            patient: 'Peter Parker',
            reason: 'Post-op Follow up',
            time: new Date(now.getTime() + 1800000).toISOString(), // 30 mins from now
            status: 'CONFIRMED',
            duration: 15
        },
        {
            id: '2',
            patient: 'Tony Stark',
            reason: 'Palpitations',
            time: new Date(now.getTime() + 3600000).toISOString(), // 1 hour from now
            status: 'CONFIRMED',
            duration: 30
        },
    ];
}

export async function generateSessionToken(visitId: string) {
    // Mock token generation
    return { token: 'mock-video-token-12345', room: `visit-${visitId}` };
}
