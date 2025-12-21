'use server';

import { sql } from '@/lib/db-sql';
import { calculateWisconsinUnits } from './evv';
import { getCurrentUser } from '@/lib/auth';

export interface BillingError {
    visitId: string;
    ruleId: string;
    message: string;
    severity: 'ERROR' | 'WARNING';
}

/**
 * Validates a visit against common Wisconsin billing rules.
 * "Sleep-Well" Billing rules:
 * 1. Missing Signatures
 * 2. Overlapping Shifts
 * 3. Unauthorized Overtime (Exceeding Auth Units)
 */
export async function validateVisit(visitId: string): Promise<BillingError[]> {
    const visit = sql.get<any>(`
        SELECT * FROM Visit WHERE id = ?
    `, [visitId]);

    if (!visit) return [];

    const errors: BillingError[] = [];

    // Rule 1: Missing Signature for verified/completed visits
    if ((visit.status === 'COMPLETED' || visit.status === 'VERIFIED') && !visit.clientSignature) {
        errors.push({
            visitId,
            ruleId: 'MISSING_SIGNATURE',
            message: 'Visit is completed but missing client signature.',
            severity: 'ERROR'
        });
    }

    // Rule 2: Overlapping Shifts (Same Caregiver)
    if (visit.startDateTime && visit.endDateTime) {
        const overlappingByCaregiver = sql.get<any>(`
            SELECT id FROM Visit 
            WHERE id != ? 
            AND caregiverId = ? 
            AND status IN ('IN_PROGRESS', 'COMPLETED', 'VERIFIED', 'SUBMITTED') 
            AND startDateTime < ? 
            AND endDateTime > ?
            LIMIT 1
        `, [visitId, visit.caregiverId, visit.endDateTime, visit.startDateTime]);

        if (overlappingByCaregiver) {
            errors.push({
                visitId,
                ruleId: 'OVERLAPPING_SHIFT_CAREGIVER',
                message: `Overlapping shift for caregiver with Visit ${overlappingByCaregiver.id}.`,
                severity: 'ERROR'
            });
        }

        // Rule 3: Overlapping Shifts (Same Client)
        const overlappingByClient = sql.get<any>(`
            SELECT id FROM Visit 
            WHERE id != ? 
            AND clientId = ? 
            AND status IN ('IN_PROGRESS', 'COMPLETED', 'VERIFIED', 'SUBMITTED') 
            AND startDateTime < ? 
            AND endDateTime > ?
            LIMIT 1
        `, [visitId, visit.clientId, visit.endDateTime, visit.startDateTime]);

        if (overlappingByClient) {
            errors.push({
                visitId,
                ruleId: 'OVERLAPPING_SHIFT_CLIENT',
                message: `Overlapping shift for client with Visit ${overlappingByClient.id}.`,
                severity: 'ERROR'
            });
        }
    }

    // Rule 4: Authorization Check
    const auth = sql.get<any>(`
        SELECT * FROM Authorization 
        WHERE contactId = ? 
        AND serviceCode = ? 
        AND status = 'ACTIVE' 
        AND startDate <= ? 
        AND endDate >= ?
        LIMIT 1
    `, [visit.clientId, visit.serviceType, visit.startDateTime, visit.startDateTime]);

    if (!auth) {
        errors.push({
            visitId,
            ruleId: 'NO_AUTHORIZATION',
            message: 'No active authorization found for this client and service type.',
            severity: 'ERROR'
        });
    } else {
        const units = visit.endDateTime ? await calculateWisconsinUnits(new Date(visit.startDateTime), new Date(visit.endDateTime)) : 0;
        if (auth.usedUnits + units > auth.totalUnits) {
            errors.push({
                visitId,
                ruleId: 'AUTH_EXCEEDED',
                message: `This visit exceeds the remaining authorized units (Total: ${auth.totalUnits}, Used: ${auth.usedUnits}).`,
                severity: 'ERROR'
            });
        }
    }

    return errors;
}

/**
 * Returns visits that have billing errors and need attention.
 * Flagged RED on the dashboard.
 */
export async function getVisitsRequiringAttention() {
    const visits = sql.all<any>(`
        SELECT * FROM Visit 
        WHERE status IN ('COMPLETED', 'VERIFIED') 
        ORDER BY updatedAt DESC 
        LIMIT 50
    `);

    const flagged = [];
    for (const visit of visits) {
        // Hydrate relations manually if needed
        const client = sql.get(`SELECT * FROM Contact WHERE id = ?`, [visit.clientId]);
        const caregiver = sql.get(`SELECT * FROM User WHERE id = ?`, [visit.caregiverId]);
        visit.client = client;
        visit.caregiver = caregiver;

        const errors = await validateVisit(visit.id);
        if (errors.length > 0) {
            flagged.push({
                ...visit,
                errors
            });
        }
    }

    return flagged;
}

export async function getClaims() {
    const user = await getCurrentUser();
    if (!user || !user.organizationId) return { success: false, error: 'Unauthorized' };

    try {
        const claims = sql.all<any>(`
            SELECT * FROM Claim 
            WHERE organizationId = ? 
            ORDER BY updatedAt DESC
        `, [user.organizationId]);

        // Hydrate
        for (const claim of claims) {
            claim.contact = sql.get(`SELECT * FROM Contact WHERE id = ?`, [claim.contactId]);
            claim.organization = sql.get(`SELECT * FROM Organization WHERE id = ?`, [claim.organizationId]);
        }

        return { success: true, data: claims };
    } catch (error) {
        console.error('Error fetching claims:', error);
        return { success: false, error: 'Failed to fetch claims' };
    }
}

export async function getInvoices() {
    const user = await getCurrentUser();
    if (!user || !user.organizationId) return { success: false, error: 'Unauthorized' };

    try {
        const invoices = sql.all<any>(`
            SELECT * FROM Invoice 
            WHERE organizationId = ? 
            ORDER BY date DESC
        `, [user.organizationId]);

        for (const inv of invoices) {
            inv.contact = sql.get(`SELECT * FROM Contact WHERE id = ?`, [inv.contactId]);
            inv.items = sql.all(`SELECT * FROM InvoiceItem WHERE invoiceId = ?`, [inv.id]);
        }

        return { success: true, data: invoices };
    } catch (error) {
        console.error('Error fetching invoices:', error);
        return { success: false, error: 'Failed to fetch invoices' };
    }
}

export async function getBillingAnalytics() {
    const user = await getCurrentUser();
    if (!user || !user.organizationId) return { success: false, error: 'Unauthorized' };

    try {
        const result = sql.get<any>(`
            SELECT SUM(totalAmount) as total 
            FROM Invoice 
            WHERE organizationId = ? 
            AND status != 'PAID'
        `, [user.organizationId]);

        // Mock data for specific payer breakdown until we have enough real data
        const payerBreakdown = [
            { payer: 'Medicare Part A', percent: 45, color: 'blue' },
            { payer: 'UHC Wisconsin', percent: 25, color: 'rose' },
            { payer: 'Medicaid - ForwardHealth', percent: 30, color: 'emerald' },
        ];

        return {
            success: true,
            data: {
                totalReceivables: result?.total || 0,
                payerBreakdown
            }
        };
    } catch (error) {
        console.error('Error fetching analytics:', error);
        return { success: false, error: 'Failed to fetch analytics' };
    }
}

export async function generateBatch() {
    const user = await getCurrentUser();
    if (!user || !user.organizationId) return { success: false, error: 'Unauthorized' };

    try {
        const result = sql.run(`
            UPDATE Claim 
            SET status = 'SUBMITTED', updatedAt = ? 
            WHERE organizationId = ? AND status = 'DRAFT'
        `, [sql.now(), user.organizationId]);

        return { success: true, count: result.changes, message: `Successfully batched ${result.changes} claims.` };
    } catch (error) {
        console.error('Error generating batch:', error);
        return { success: false, error: 'Failed to generate batch' };
    }
}

export async function createClaimsFromVisits() {
    const user = await getCurrentUser();
    if (!user || !user.organizationId) return { success: false, error: 'Unauthorized' };

    try {
        const verifiedVisits = sql.all<any>(`
            SELECT * FROM Visit 
            WHERE organizationId = ? 
            AND status = 'VERIFIED' 
            AND claimId IS NULL
        `, [user.organizationId]);

        let count = 0;
        for (const visit of verifiedVisits) {
            if (!visit.startDateTime) continue;

            const units = await calculateWisconsinUnits(new Date(visit.startDateTime), new Date(visit.endDateTime || visit.startDateTime));
            const rate = 15.00; // Mock rate per unit
            const total = units * rate;
            const claimId = sql.id();
            const now = sql.now();

            sql.run(`
                INSERT INTO Claim (id, claimId, organizationId, contactId, status, totalBilled, diagnosisCodes, serviceDateStart, serviceDateEnd, payerName, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                claimId,
                `CLM-${Date.now()}-${visit.id.substring(0, 4)}`,
                user.organizationId,
                visit.clientId,
                'DRAFT',
                total,
                JSON.stringify([]),
                visit.startDateTime,
                visit.endDateTime || visit.startDateTime,
                'Medicaid - ForwardHealth',
                now,
                now
            ]);

            sql.run(`UPDATE Visit SET claimId = ? WHERE id = ?`, [claimId, visit.id]);
            count++;
        }
        return { success: true, count, message: `Created ${count} claims from verified visits.` };
    } catch (e) {
        console.error(e);
        return { success: false, error: 'Failed to create claims' };
    }
}
