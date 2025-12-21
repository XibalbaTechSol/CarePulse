'use server';

import { sql } from '@/lib/db-sql';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function createClient(formData: FormData) {
    const currentUser = await getCurrentUser();

    if (!currentUser.organizationId) {
        return { error: 'User does not belong to an organization' };
    }

    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const city = formData.get('city') as string;
    const state = formData.get('state') as string;
    const zip = formData.get('zip') as string;
    const medicaidId = formData.get('medicaidId') as string;
    const dobString = formData.get('dateOfBirth') as string;

    try {
        const id = sql.id();
        const now = sql.now();
        sql.run(`
            INSERT INTO Contact (
                id, firstName, lastName, email, phone, address, city, state, zip, medicaidId, dateOfBirth, 
                status, organizationId, userId, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            id, firstName, lastName, email, phone, address, city, state, zip, medicaidId, dobString ? new Date(dobString).toISOString() : null,
            'CUSTOMER', currentUser.organizationId, currentUser.id, now, now
        ]);
        revalidatePath('/dashboard/crm');
        return { success: true };
    } catch (error) {
        console.error('Failed to create client:', error);
        return { error: 'Failed to create client.' };
    }
}

export async function getClients() {
    const currentUser = await getCurrentUser();
    if (!currentUser.organizationId) return [];

    return sql.all<any>(`
        SELECT * FROM Contact 
        WHERE organizationId = ? 
        AND status IN ('CUSTOMER', 'LEAD') 
        ORDER BY updatedAt DESC
    `, [currentUser.organizationId]);
}

export async function getClient(id: string) {
    const currentUser = await getCurrentUser();
    if (!currentUser.organizationId) return null;

    const client = sql.get<any>(`
        SELECT * FROM Contact 
        WHERE id = ? AND organizationId = ?
    `, [id, currentUser.organizationId]);

    if (client) {
        // Hydrate care plans
        const carePlans = sql.all<any>(`SELECT * FROM CarePlan WHERE contactId = ?`, [client.id]);
        for (const plan of carePlans) {
            plan.tasks = sql.all(`SELECT * FROM CarePlanTask WHERE carePlanId = ?`, [plan.id]);
        }
        client.carePlans = carePlans;
        client.documents = sql.all(`SELECT * FROM Document WHERE contactId = ?`, [client.id]);
    }

    return client;
}

export async function createCarePlanTask(carePlanId: string, formData: FormData) {

    const taskName = formData.get('taskName') as string;
    const frequency = formData.get('frequency') as string;
    const category = formData.get('category') as string;

    try {
        const id = sql.id();
        const now = sql.now();
        sql.run(`
            INSERT INTO CarePlanTask (id, carePlanId, taskName, frequency, category, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [id, carePlanId, taskName, frequency, category, now, now]);

        const plan = sql.get<any>(`SELECT contactId FROM CarePlan WHERE id = ?`, [carePlanId]);
        if (plan) {
            revalidatePath(`/dashboard/crm/${plan.contactId}`);
        }

        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: 'Failed to create task' };
    }
}

export async function ensureCarePlan(contactId: string) {
    // Helper to ensure a default care plan exists
    const currentUser = await getCurrentUser();
    if (!currentUser.organizationId) return null;

    let plan = sql.get<any>(`
        SELECT * FROM CarePlan 
        WHERE contactId = ? 
        AND status = 'ACTIVE'
        LIMIT 1
    `, [contactId]);

    if (!plan) {
        const id = sql.id();
        const now = sql.now();
        sql.run(`
            INSERT INTO CarePlan (id, contactId, organizationId, title, status, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, 'ACTIVE', ?, ?)
        `, [id, contactId, currentUser.organizationId, 'General Care Plan', now, now]);

        plan = sql.get<any>(`SELECT * FROM CarePlan WHERE id = ?`, [id]);
    }

    if (plan) {
        plan.tasks = sql.all(`SELECT * FROM CarePlanTask WHERE carePlanId = ?`, [plan.id]);
    }

    return plan;
}

export async function saveCarePlan(contactId: string, title: string, tasks: { taskName: string; category: string }[]) {
    const currentUser = await getCurrentUser();
    if (!currentUser.organizationId) {
        throw new Error('User does not belong to an organization');
    }

    try {
        // Find existing active plan to update or create new
        let existingPlan = sql.get<any>(`
            SELECT id FROM CarePlan 
            WHERE contactId = ? AND status = 'ACTIVE'
            LIMIT 1
        `, [contactId]);

        const now = sql.now();

        if (existingPlan) {
            // Update existing plan
            sql.run(`UPDATE CarePlan SET title = ?, updatedAt = ? WHERE id = ?`, [title, now, existingPlan.id]);

            // Replace tasks (delete all and create new for simplicity in this builder)
            // First delete relations from VisitTask if any (assuming cascade or we can ignore constraints for this simplified logic? 
            // Better-sqlite3 foreign key constraints are on, so we must be careful.
            // Wait, VisitTask links to CarePlanTask. If we delete CarePlanTask, we need to handle Visits.
            // The original logic did:
            // await prisma.visitTask.deleteMany({ where: { task: { carePlanId: existingPlan.id } } });
            // await prisma.carePlanTask.deleteMany({ where: { carePlanId: existingPlan.id } });

            // Delete VisitTasks linked to tasks of this plan
            sql.run(`
                DELETE FROM VisitTask 
                WHERE taskId IN (SELECT id FROM CarePlanTask WHERE carePlanId = ?)
            `, [existingPlan.id]);

            // Delete CarePlanTasks
            sql.run(`DELETE FROM CarePlanTask WHERE carePlanId = ?`, [existingPlan.id]);

            // Create new tasks
            for (const t of tasks) {
                const id = sql.id();
                sql.run(`
                    INSERT INTO CarePlanTask (id, carePlanId, taskName, category, frequency, createdAt, updatedAt)
                    VALUES (?, ?, ?, ?, 'EVERY_VISIT', ?, ?)
                `, [id, existingPlan.id, t.taskName, t.category, now, now]);
            }
        } else {
            // Create new plan
            const planId = sql.id();
            sql.run(`
                INSERT INTO CarePlan (id, contactId, organizationId, title, status, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, 'ACTIVE', ?, ?)
            `, [planId, contactId, currentUser.organizationId, title, now, now]);

            for (const t of tasks) {
                const id = sql.id();
                sql.run(`
                    INSERT INTO CarePlanTask (id, carePlanId, taskName, category, frequency, createdAt, updatedAt)
                    VALUES (?, ?, ?, ?, 'EVERY_VISIT', ?, ?)
                `, [id, planId, t.taskName, t.category, now, now]);
            }
        }

        revalidatePath(`/dashboard/crm/${contactId}`);
        revalidatePath(`/dashboard/crm/care-plans/${contactId}`);
        return { success: true };

    } catch (error) {
        console.error('Failed to save care plan:', error);
        throw new Error('Failed to save care plan');
    }
}

export async function exportLeadsAction() {
    const currentUser = await getCurrentUser();
    if (!currentUser.organizationId) {
        return { error: 'Unauthorized' };
    }

    try {
        const leads = sql.all<any>(`
            SELECT * FROM Contact 
            WHERE organizationId = ? 
            AND status = 'LEAD'
        `, [currentUser.organizationId]);

        // CSV Header
        const header = 'First Name,Last Name,Email,Phone,Company,Status,Created At\n';

        // CSV Rows
        const rows = leads.map(lead => {
            return `${lead.firstName},${lead.lastName},${lead.email || ''},${lead.phone || ''},${lead.company || ''},${lead.status},${new Date(lead.createdAt).toISOString()}`;
        }).join('\n');

        return { data: header + rows };
    } catch (error) {
        console.error('Failed to export leads:', error);
        return { error: 'Failed to export leads' };
    }
}
