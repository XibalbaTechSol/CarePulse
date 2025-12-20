'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

/**
 * Fetches clients for the Audit Vault selection list.
 */
export async function getClientsForAudit() {
    const user = await getCurrentUser();
    if (!user || !user.organizationId) throw new Error('Unauthorized');

    return await prisma.contact.findMany({
        where: {
            organizationId: user.organizationId,
            status: 'CUSTOMER'
        },
        include: {
            _count: {
                select: { clientVisits: true, authorizations: true }
            }
        },
        orderBy: { lastName: 'asc' }
    });
}

/**
 * Compiles all data required for a Wisconsin T1019 Audit.
 */
export async function getAuditData(clientId: string, startDate: string, endDate: string) {
    const user = await getCurrentUser();
    if (!user || !user.organizationId) throw new Error('Unauthorized');

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const client = await prisma.contact.findUnique({
        where: { id: clientId },
        include: {
            authorizations: {
                where: {
                    OR: [
                        { startDate: { lte: end }, endDate: { gte: start } }
                    ]
                }
            },
            clientVisits: {
                where: {
                    startDateTime: { gte: start, lte: end },
                    status: { in: ['COMPLETED', 'VERIFIED', 'SUBMITTED'] }
                },
                include: {
                    caregiver: true,
                    completedTasks: {
                        include: { task: true }
                    }
                },
                orderBy: { startDateTime: 'asc' }
            }
        }
    });

    return {
        client,
        period: { start, end },
        generatedAt: new Date(),
        auditorInfo: {
            agencyName: user.organization?.name || 'Xibalba Solutions Agency',
            agencyId: 'WI-DHS-8822' // Mock Wisconsin Provider ID
        }
    };
}
