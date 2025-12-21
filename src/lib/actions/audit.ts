'use server';

import { sql } from '@/lib/db-sql';
import { getCurrentUser } from '@/lib/auth';

/**
 * Fetches clients for the Audit Vault selection list.
 */
export async function getClientsForAudit() {
    const user = await getCurrentUser();
    if (!user || !user.organizationId) throw new Error('Unauthorized');

    const contacts = sql.all<any>(`
        SELECT * FROM Contact 
        WHERE organizationId = ? 
        AND status = 'CUSTOMER' 
        ORDER BY lastName ASC
    `, [user.organizationId]);

    // Manually count for _count
    for (const contact of contacts) {
        const visitCount = sql.get<any>(`SELECT COUNT(*) as c FROM Visit WHERE clientId = ?`, [contact.id])?.c || 0;
        const authCount = sql.get<any>(`SELECT COUNT(*) as c FROM Authorization WHERE contactId = ?`, [contact.id])?.c || 0;
        contact._count = { clientVisits: visitCount, authorizations: authCount };
    }

    return contacts;
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

    const startIso = start.toISOString();
    const endIso = end.toISOString();

    const client = sql.get<any>(`SELECT * FROM Contact WHERE id = ?`, [clientId]);

    if (!client) throw new Error('Client not found');

    const authorizations = sql.all<any>(`
        SELECT * FROM Authorization 
        WHERE contactId = ? 
        AND (startDate <= ? AND endDate >= ?)
    `, [clientId, endIso, startIso]);

    const clientVisits = sql.all<any>(`
        SELECT * FROM Visit 
        WHERE clientId = ? 
        AND startDateTime >= ? 
        AND startDateTime <= ? 
        AND status IN ('COMPLETED', 'VERIFIED', 'SUBMITTED') 
        ORDER BY startDateTime ASC
    `, [clientId, startIso, endIso]);

    for (const visit of clientVisits) {
        visit.caregiver = sql.get(`SELECT * FROM User WHERE id = ?`, [visit.caregiverId]);

        // Fetch completed tasks
        const visitTasks = sql.all<any>(`
            SELECT vt.*, t.taskName, t.category 
            FROM VisitTask vt
            LEFT JOIN CarePlanTask t ON vt.taskId = t.id
            WHERE vt.visitId = ? 
            AND vt.status = 'COMPLETED'
        `, [visit.id]);

        // Map to match structure expected by UI (VisitTask linked to Task)
        visit.completedTasks = visitTasks.map(vt => ({
            ...vt,
            task: {
                id: vt.taskId,
                taskName: vt.taskName,
                category: vt.category
            }
        }));
    }

    client.authorizations = authorizations;
    client.clientVisits = clientVisits;

    const org = sql.get<any>(`SELECT * FROM Organization WHERE id = ?`, [user.organizationId]);

    return {
        client,
        period: { start, end },
        generatedAt: new Date(),
        auditorInfo: {
            agencyName: org?.name || 'Xibalba Solutions Agency',
            agencyId: 'WI-DHS-8822' // Mock Wisconsin Provider ID
        }
    };
}
