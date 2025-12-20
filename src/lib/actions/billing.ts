'use server';

import { prisma } from '@/lib/db';
import { calculateWisconsinUnits } from './evv';

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
    const visit = await prisma.visit.findUnique({
        where: { id: visitId },
        include: { client: true, caregiver: true }
    });

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
        const overlappingByCaregiver = await prisma.visit.findFirst({
            where: {
                id: { not: visitId },
                caregiverId: visit.caregiverId,
                status: { in: ['IN_PROGRESS', 'COMPLETED', 'VERIFIED', 'SUBMITTED'] },
                AND: [
                    { startDateTime: { lt: visit.endDateTime } },
                    { endDateTime: { gt: visit.startDateTime } }
                ]
            }
        });

        if (overlappingByCaregiver) {
            errors.push({
                visitId,
                ruleId: 'OVERLAPPING_SHIFT_CAREGIVER',
                message: `Overlapping shift for caregiver with Visit ${overlappingByCaregiver.id}.`,
                severity: 'ERROR'
            });
        }

        // Rule 3: Overlapping Shifts (Same Client)
        const overlappingByClient = await prisma.visit.findFirst({
            where: {
                id: { not: visitId },
                clientId: visit.clientId,
                status: { in: ['IN_PROGRESS', 'COMPLETED', 'VERIFIED', 'SUBMITTED'] },
                AND: [
                    { startDateTime: { lt: visit.endDateTime } },
                    { endDateTime: { gt: visit.startDateTime } }
                ]
            }
        });

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
    const auth = await prisma.authorization.findFirst({
        where: {
            contactId: visit.clientId,
            serviceCode: visit.serviceType,
            status: 'ACTIVE',
            startDate: { lte: visit.startDateTime },
            endDate: { gte: visit.startDateTime }
        }
    });

    if (!auth) {
        errors.push({
            visitId,
            ruleId: 'NO_AUTHORIZATION',
            message: 'No active authorization found for this client and service type.',
            severity: 'ERROR'
        });
    } else {
        const units = visit.endDateTime ? await calculateWisconsinUnits(visit.startDateTime!, visit.endDateTime) : 0;
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
    const visits = await prisma.visit.findMany({
        where: {
            status: { in: ['COMPLETED', 'VERIFIED'] }
        },
        include: {
            client: true,
            caregiver: true
        },
        take: 50,
        orderBy: { updatedAt: 'desc' }
    });

    const flagged = [];
    for (const visit of visits) {
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

import { getCurrentUser } from '@/lib/auth';

export async function getClaims() {
    const user = await getCurrentUser();
    if (!user || !user.organizationId) return { success: false, error: 'Unauthorized' };

    try {
        const claims = await prisma.claim.findMany({
            where: { organizationId: user.organizationId },
            include: {
                contact: true,
                organization: true,
            },
            orderBy: {
                updatedAt: 'desc',
            }
        });
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
        const invoices = await prisma.invoice.findMany({
            where: { organizationId: user.organizationId },
            include: {
                contact: true,
                items: true,
            },
            orderBy: {
                date: 'desc',
            }
        });
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
        const totalReceivables = await prisma.invoice.aggregate({
            _sum: {
                totalAmount: true,
            },
            where: {
                organizationId: user.organizationId,
                status: {
                    not: 'PAID'
                }
            }
        });

        // Mock data for specific payer breakdown until we have enough real data
        const payerBreakdown = [
            { payer: 'Medicare Part A', percent: 45, color: 'blue' },
            { payer: 'UHC Wisconsin', percent: 25, color: 'rose' },
            { payer: 'Medicaid - ForwardHealth', percent: 30, color: 'emerald' },
        ];

        return {
            success: true,
            data: {
                totalReceivables: totalReceivables._sum.totalAmount || 0,
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
        // Find all DRAFT claims and update them to SUBMITTED
        // In a real EDI system, this would generate an 837P file string.
        const updated = await prisma.claim.updateMany({
            where: { organizationId: user.organizationId, status: 'DRAFT' },
            data: { status: 'SUBMITTED', updatedAt: new Date() }
        });

        return { success: true, count: updated.count, message: `Successfully batched ${updated.count} claims.` };
    } catch (error) {
        console.error('Error generating batch:', error);
        return { success: false, error: 'Failed to generate batch' };
    }
}

export async function createClaimsFromVisits() {
    const user = await getCurrentUser();
    if (!user || !user.organizationId) return { success: false, error: 'Unauthorized' };

    try {
        const verifiedVisits = await prisma.visit.findMany({
            where: {
                organizationId: user.organizationId,
                status: 'VERIFIED',
                claimId: null
            },
            include: { client: true }
        });

        let count = 0;
        for (const visit of verifiedVisits) {
            // Simplified logic: 1 Visit = 1 Claim for now
            // Ensure startDateTime is not null (it shouldn't be for VERIFIED)
            if (!visit.startDateTime) continue;

            const units = visit.endDateTime ? await calculateWisconsinUnits(visit.startDateTime, visit.endDateTime) : 0;
            const rate = 15.00; // Mock rate per unit
            const total = units * rate;

            const claim = await prisma.claim.create({
                data: {
                    claimId: `CLM-${Date.now()}-${visit.id.substring(0, 4)}`,
                    organizationId: user.organizationId,
                    contactId: visit.clientId,
                    status: 'DRAFT',
                    totalBilled: total,
                    serviceDateStart: visit.startDateTime,
                    serviceDateEnd: visit.endDateTime || visit.startDateTime,
                    payerName: 'Medicaid - ForwardHealth', // Default for now
                }
            });

            await prisma.visit.update({
                where: { id: visit.id },
                data: { claimId: claim.id }
            });
            count++;
        }
        return { success: true, count, message: `Created ${count} claims from verified visits.` };
    } catch (e) {
        console.error(e);
        return { success: false, error: 'Failed to create claims' };
    }
}
