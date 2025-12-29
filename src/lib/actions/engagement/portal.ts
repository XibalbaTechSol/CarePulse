
'use server'

import { db } from '../../db';
import { v4 as uuidv4 } from 'uuid';

export async function getPortalMessages(organizationId: string) {
    // Mock secure messages
    return [
        {
            id: '1',
            from: 'Alice Wonderland',
            subject: 'Question about medication',
            preview: 'Hi, I was wondering if I should take this with food...',
            date: '2025-05-19T10:30:00',
            status: 'UNREAD'
        },
        {
            id: '2',
            from: 'Bob Builder',
            subject: 'Refill Request',
            preview: 'I am running low on my Lisinopril...',
            date: '2025-05-18T14:15:00',
            status: 'READ'
        },
    ];
}

export async function getAppointmentRequests() {
    return [
        { id: '1', patient: 'Charlie Chaplin', requestedDate: '2025-06-01', reason: 'Annual Physical', status: 'PENDING' },
        { id: '2', patient: 'Diana Prince', requestedDate: '2025-05-25', reason: 'Shoulder Pain', status: 'PENDING' },
    ];
}

export async function sendPortalMessage(toPatientId: string, subject: string, body: string) {
    // Logic to send message
    return { success: true };
}
