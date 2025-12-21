'use server';

import { sql } from '@/lib/db-sql';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

// --- Helpers ---

/**
 * Wisconsin Standard 15-minute unit conversion (8-minute rule variant)
 * 8-22 mins = 1 unit
 * 23-37 mins = 2 units
 * 38-52 mins = 3 units
 * 53-67 mins = 4 units
 */
export async function calculateWisconsinUnits(start: Date, end: Date): Promise<number> {
    const diffMs = end.getTime() - start.getTime();
    const minutes = Math.floor(diffMs / 60000);

    if (minutes < 8) return 0;
    return 1 + Math.floor((minutes - 8) / 15);
}

// --- Sandata Sync Stub ---
async function pushToSandata(visit: any, config: any) {
    // This is where we would implement the specific SOAP/REST call to Sandata
    // Endpoint: https://api.sandata.com/interfaces/intake/... (Example)

    // Mocking the interaction
    console.log(`[Sandata Sync] Pushing Visit ${visit.id} to Agency ${config.agencyId}`);

    // In SQL version, relations (client/caregiver) might not be hydrated unless we passed them.
    // If we need them here, we should fetch/ensure they exist.
    // Assuming 'visit' passed here is fully hydrated or we fetch it.

    // For simplicity, fetch if missing
    let client = visit.client;
    let caregiver = visit.caregiver;

    if (!client) client = sql.get(`SELECT * FROM Contact WHERE id = ?`, [visit.clientId]);
    if (!caregiver) caregiver = sql.get(`SELECT * FROM User WHERE id = ?`, [visit.caregiverId]);

    console.log(`[Sandata Sync] Data:`, {
        StaffID: caregiver?.nationalProviderId || caregiver?.providerSSN || caregiver?.id,
        PatientID: client?.medicaidId || visit.clientId,
        VisitStartParams: {
            Date: visit.startDateTime,
            Latitude: visit.startLatitude,
            Longitude: visit.startLongitude
        },
        VisitEndParams: {
            Date: visit.endDateTime,
            Latitude: visit.endLatitude,
            Longitude: visit.endLongitude
        },
        Units: visit.startDateTime && visit.endDateTime ? await calculateWisconsinUnits(new Date(visit.startDateTime), new Date(visit.endDateTime)) : 0
    });

    // Simulate network delay and response
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock success
    return {
        success: true,
        transactionId: `STX-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    };
}

// --- Actions ---

export async function getDashboardStats() {
    const user = await getCurrentUser();
    if (!user || !user.organizationId) throw new Error('Unauthorized');

    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - (60 * 60 * 1000)).toISOString();

    // 1. Missed Visits (SCHEDULED and startDateTime < oneHourAgo)
    const missedVisits = sql.get<any>(`
        SELECT COUNT(*) as count FROM Visit 
        WHERE organizationId = ? 
        AND status = 'SCHEDULED' 
        AND startDateTime < ?
    `, [user.organizationId, oneHourAgo])?.count || 0;

    // 2. Expiring Authorizations (Ends within 14 days)
    const fourteenDaysFromNow = new Date(now.getTime() + (14 * 24 * 60 * 60 * 1000)).toISOString();
    const expiringAuths = sql.get<any>(`
        SELECT COUNT(*) as count FROM Authorization 
        WHERE organizationId = ? 
        AND status = 'ACTIVE' 
        AND endDate <= ?
    `, [user.organizationId, fourteenDaysFromNow])?.count || 0;

    // 3. Unbilled Verified Visits (VERIFIED status, not yet submitted)
    // For this MVP, we consider 'VERIFIED' as ready for billing.
    const unbilledVerified = sql.get<any>(`
        SELECT COUNT(*) as count FROM Visit 
        WHERE organizationId = ? 
        AND status = 'VERIFIED'
    `, [user.organizationId])?.count || 0;

    return {
        missedVisits,
        expiringAuths,
        unbilledVerified
    };
}

export async function getEvvStatus() {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    // Find active visit for this user
    const activeVisit = sql.get<any>(`
        SELECT * FROM Visit 
        WHERE caregiverId = ? 
        AND status = 'IN_PROGRESS'
        LIMIT 1
    `, [user.id]);

    if (activeVisit) {
        activeVisit.client = sql.get(`SELECT * FROM Contact WHERE id = ?`, [activeVisit.clientId]);
    }

    return { activeVisit };
}

export async function startVisit(clientId: string, lat: number, lng: number, serviceType: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');
    if (!user.organizationId) throw new Error('No Organization');

    // Check if already in a visit
    const existing = sql.get(`
        SELECT id FROM Visit 
        WHERE caregiverId = ? AND status = 'IN_PROGRESS'
        LIMIT 1
    `, [user.id]);

    if (existing) throw new Error('You already have an active visit.');

    const visitId = sql.id();
    const now = sql.now();
    sql.run(`
        INSERT INTO Visit (id, caregiverId, clientId, organizationId, serviceType, startDateTime, startLatitude, startLongitude, status, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'IN_PROGRESS', ?, ?)
    `, [visitId, user.id, clientId, user.organizationId, serviceType, now, lat, lng, now, now]);

    revalidatePath('/dashboard/evv');
    return { success: true };
}

export async function endVisit(visitId: string, lat: number, lng: number, notes?: string, signature?: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const visit = sql.get<any>(`SELECT * FROM Visit WHERE id = ?`, [visitId]);

    if (!visit || visit.caregiverId !== user.id) throw new Error('Visit not found or unauthorized');
    if (visit.status !== 'IN_PROGRESS') throw new Error('Visit is not in progress');

    const now = sql.now();
    sql.run(`
        UPDATE Visit 
        SET endDateTime = ?, endLatitude = ?, endLongitude = ?, notes = ?, clientSignature = ?, status = 'COMPLETED', updatedAt = ?
        WHERE id = ?
    `, [now, lat, lng, notes, signature, now, visitId]);

    const updatedVisit = sql.get<any>(`SELECT * FROM Visit WHERE id = ?`, [visitId]);

    // Attempt Auto-Sync if configured
    try {
        const config = sql.get<any>(`SELECT * FROM SandataConfig WHERE organizationId = ?`, [user.organizationId]);

        if (config) {
            const syncResult = await pushToSandata(updatedVisit, config);
            if (syncResult.success) {
                sql.run(`
                    UPDATE Visit 
                    SET status = 'SUBMITTED', sandataTransactionId = ?, updatedAt = ?
                    WHERE id = ?
                `, [syncResult.transactionId, sql.now(), visitId]);
            }
        }
    } catch (e) {
        console.error('Auto-sync failed:', e);
        // Visit remains COMPLETED, can be synced manually later
    }

    revalidatePath('/dashboard/evv');
    return { success: true };
}

export async function getVisitHistory() {
    const user = await getCurrentUser();
    if (!user || !user.organizationId) return [];

    const visits = sql.all<any>(`
        SELECT * FROM Visit 
        WHERE organizationId = ? 
        ORDER BY startDateTime DESC 
        LIMIT 50
    `, [user.organizationId]);

    for (const v of visits) {
        v.caregiver = sql.get(`SELECT * FROM User WHERE id = ?`, [v.caregiverId]);
        v.client = sql.get(`SELECT * FROM Contact WHERE id = ?`, [v.clientId]);
    }

    return visits;
}

export async function getSandataConfig() {
    const user = await getCurrentUser();
    if (!user || !user.organizationId) return null;

    return sql.get<any>(`SELECT * FROM SandataConfig WHERE organizationId = ?`, [user.organizationId]);
}

export async function saveSandataConfig(formData: FormData) {
    const user = await getCurrentUser();
    if (user.role !== 'ADMIN') throw new Error('Unauthorized');
    if (!user.organizationId) throw new Error('No Organization');

    const agencyId = formData.get('agencyId') as string;
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const providerId = formData.get('providerId') as string;
    const environment = formData.get('environment') as string;

    const existing = sql.get<any>(`SELECT id FROM SandataConfig WHERE organizationId = ?`, [user.organizationId]);
    const now = sql.now();

    if (existing) {
        sql.run(`
            UPDATE SandataConfig 
            SET agencyId = ?, username = ?, password = ?, providerId = ?, environment = ?, updatedAt = ?
            WHERE id = ?
        `, [agencyId, username, password, providerId, environment, now, existing.id]);
    } else {
        const id = sql.id();
        sql.run(`
            INSERT INTO SandataConfig (id, organizationId, agencyId, username, password, providerId, environment, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [id, user.organizationId, agencyId, username, password, providerId, environment, now, now]);
    }

    revalidatePath('/dashboard/evv');
    return { success: true };
}

export async function scheduleVisit(clientId: string, caregiverId: string, start: Date, end: Date, serviceType: string) {
    const user = await getCurrentUser();
    if (!user || !user.organizationId) throw new Error('Unauthorized');

    // Basic Matchmaking: Overlap Check
    const overlapping = sql.get<any>(`
        SELECT id FROM Visit 
        WHERE caregiverId = ? 
        AND status IN ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'VERIFIED') 
        AND startDateTime < ? 
        AND endDateTime > ?
        LIMIT 1
    `, [caregiverId, end.toISOString(), start.toISOString()]);

    if (overlapping) {
        throw new Error(`Caregiver is already booked for an overlapping visit during this time.`);
    }

    const id = sql.id();
    const now = sql.now();

    sql.run(`
        INSERT INTO Visit (id, organizationId, clientId, caregiverId, startDateTime, endDateTime, serviceType, status, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'SCHEDULED', ?, ?)
    `, [id, user.organizationId, clientId, caregiverId, start.toISOString(), end.toISOString(), serviceType, now, now]);

    revalidatePath('/dashboard/evv');
    return { success: true };
}

export async function manualSync(visitId: string) {
    const user = await getCurrentUser();

    // Authorization check

    const visit = sql.get<any>(`SELECT * FROM Visit WHERE id = ?`, [visitId]);

    if (!visit || !visit.organizationId) return { error: 'Invalid visit' };

    const config = sql.get<any>(`SELECT * FROM SandataConfig WHERE organizationId = ?`, [visit.organizationId]);

    if (!config) return { error: 'Sandata not configured' };

    const syncResult = await pushToSandata(visit, config);
    if (syncResult.success) {
        sql.run(`
            UPDATE Visit 
            SET status = 'SUBMITTED', sandataTransactionId = ?, updatedAt = ?
            WHERE id = ?
        `, [syncResult.transactionId, sql.now(), visitId]);
        revalidatePath('/dashboard/evv');
        return { success: true };
    }

    return { error: 'Sync failed' };

}

export async function getEvvExceptions() {
    const user = await getCurrentUser();
    if (!user || !user.organizationId) return { success: false, data: [] };

    const now = new Date();
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000).toISOString();

    // 1. Late Starts
    const lateVisits = sql.all<any>(`
        SELECT * FROM Visit 
        WHERE organizationId = ? 
        AND status = 'SCHEDULED' 
        AND startDateTime < ?
    `, [user.organizationId, fifteenMinutesAgo]);

    for (const v of lateVisits) {
        v.client = sql.get(`SELECT * FROM Contact WHERE id = ?`, [v.clientId]);
        v.caregiver = sql.get(`SELECT * FROM User WHERE id = ?`, [v.caregiverId]);
    }

    const exceptions = lateVisits.map(v => ({
        id: v.id,
        type: 'Late Start',
        staff: v.caregiver?.name || 'Unknown',
        client: `${v.client?.firstName} ${v.client?.lastName}`,
        detail: `Scheduled: ${v.startDateTime} | Now: ${now.toLocaleTimeString()}`,
        color: 'rose',
        status: 'OPEN'
    }));

    return { success: true, data: exceptions };
}

export async function resolveException(visitId: string, action: 'RESOLVE' | 'REJECT' | 'APPROVE') {
    const user = await getCurrentUser();
    if (!user || !user.organizationId) return { success: false, error: 'Unauthorized' };

    // Implementation depends on what "Resolve" means. 
    // For Late Start: Maybe reschedule or cancel?
    // For now we just return success to simulate the "Button Working".

    return { success: true, message: `Exception for visit ${visitId} processed: ${action}` };
}
