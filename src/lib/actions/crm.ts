'use server';

import { sql, db } from '@/lib/db-sql';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getContacts(query?: string) {
    const user = await getCurrentUser();
    if (!user) return [];

    try {
        let queryStr = `SELECT * FROM Contact WHERE organizationId = ?`;
        const params: any[] = [user.organizationId];

        if (query) {
            queryStr += ` AND (firstName LIKE ? OR lastName LIKE ? OR email LIKE ? OR phone LIKE ? OR company LIKE ?)`;
            const q = `%${query}%`;
            params.push(q, q, q, q, q);
        }

        queryStr += ` ORDER BY updatedAt DESC LIMIT 50`;

        return sql.all(queryStr, params);
    } catch (error) {
        console.error('Failed to fetch contacts:', error);
        return [];
    }
}

export async function createContact(data: any) {
    const user = await getCurrentUser();
    if (!user) return { error: 'Unauthorized' };

    try {
        const id = sql.id();
        const now = sql.now();

        sql.run(`
            INSERT INTO Contact (
                id, firstName, lastName, email, phone, company, status, 
                organizationId, userId, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            id,
            data.firstName,
            data.lastName,
            data.email,
            data.phone,
            data.company,
            'LEAD', // Default status
            user.organizationId,
            user.id,
            now,
            now
        ]);

        revalidatePath('/dashboard/crm');
        revalidatePath('/dashboard/phone');

        const newContact = sql.get(`SELECT * FROM Contact WHERE id = ?`, [id]);
        return { success: true, contact: newContact };
    } catch (error) {
        console.error('Failed to create contact:', error);
        return { error: 'Failed to create contact' };
    }
}

export async function updateContact(id: string, data: any) {
    const user = await getCurrentUser();
    if (!user) return { error: 'Unauthorized' };

    try {
        const fields: string[] = [];
        const params: any[] = [];
        const allowedFields = ['firstName', 'lastName', 'email', 'phone', 'company', 'status', 'address', 'city', 'state', 'zip'];

        for (const field of allowedFields) {
            if (data[field] !== undefined) {
                fields.push(`${field} = ?`);
                params.push(data[field]);
            }
        }

        fields.push(`updatedAt = ?`);
        params.push(sql.now());

        params.push(id);

        if (fields.length > 0) {
            sql.run(`UPDATE Contact SET ${fields.join(', ')} WHERE id = ?`, params);
        }

        revalidatePath('/dashboard/crm');
        revalidatePath('/dashboard/phone');

        const updatedContact = sql.get(`SELECT * FROM Contact WHERE id = ?`, [id]);
        return { success: true, contact: updatedContact };
    } catch (error) {
        console.error('Failed to update contact:', error);
        return { error: 'Failed to update contact' };
    }
}

export async function getContact(id: string) {
    const user = await getCurrentUser();
    if (!user) return null;

    try {
        const contact: any = sql.get(`SELECT * FROM Contact WHERE id = ?`, [id]);
        if (!contact) return null;

        contact.deals = sql.all(`SELECT * FROM Deal WHERE contactId = ?`, [id]);
        contact.tasks = sql.all(`SELECT * FROM Task WHERE contactId = ?`, [id]);
        contact.activities = sql.all(`SELECT * FROM Activity WHERE contactId = ? ORDER BY createdAt DESC LIMIT 5`, [id]);

        contact.tags = sql.all(`
            SELECT t.* FROM Tag t
            JOIN ContactTag ct ON ct.tagId = t.id
            WHERE ct.contactId = ?
        `, [id]);

        return contact;
    } catch (error) {
        console.error("Failed to fetch contact", error);
        return null;
    }
}

export async function getLeadsForKanban() {
    const user = await getCurrentUser();
    if (!user) return [];

    try {
        // Fetch contacts with their tags
        const contacts: any[] = sql.all(`
            SELECT c.*, 
            (
                SELECT json_group_array(json_object('id', t.id, 'name', t.name, 'color', t.color))
                FROM Tag t
                JOIN ContactTag ct ON ct.tagId = t.id
                WHERE ct.contactId = c.id
            ) as tags
            FROM Contact c 
            WHERE c.organizationId = ? 
        `, [user.organizationId]);

        // Parse tags
        return contacts.map((c: any) => ({
            ...c,
            tags: c.tags ? JSON.parse(c.tags) : []
        }));
    } catch (error) {
        console.error('Failed to fetch leads:', error);
        return [];
    }
}

export async function updateContactStatus(id: string, status: string) {
    const user = await getCurrentUser();
    if (!user) return { error: 'Unauthorized' };

    try {
        sql.run(`UPDATE Contact SET status = ?, updatedAt = ? WHERE id = ?`, [status, sql.now(), id]);
        revalidatePath('/dashboard/crm');
        return { success: true };
    } catch (error) {
        console.error('Failed to update status:', error);
        return { error: 'Failed to update status' };
    }
}

export async function getClient(id: string) {
    const contact = await getContact(id);
    if (!contact) return null;

    try {
        const carePlans = sql.all(`SELECT * FROM CarePlan WHERE contactId = ? ORDER BY createdAt DESC`, [id]);

        // Enhance care plans with tasks
        for (const plan of carePlans as any[]) {
            plan.tasks = sql.all(`SELECT * FROM CarePlanTask WHERE carePlanId = ?`, [plan.id]);
        }

        return { ...contact, carePlans };
    } catch (error) {
        console.error('Failed to fetch client details:', error);
        return { ...contact, carePlans: [] };
    }
}

export async function ensureCarePlan(contactId: string) {
    const user = await getCurrentUser();
    if (!user) return null;

    try {
        // Check for active plan
        let plan = sql.get(`SELECT * FROM CarePlan WHERE contactId = ? AND status = 'ACTIVE'`, [contactId]);

        if (!plan) {
            const id = sql.id();
            const now = sql.now();

            sql.run(`
                INSERT INTO CarePlan (id, contactId, organizationId, title, status, createdAt, updatedAt)
                VALUES (?, ?, ?, 'Initial Care Plan', 'ACTIVE', ?, ?)
            `, [id, contactId, user.organizationId, now, now]);

            plan = sql.get(`SELECT * FROM CarePlan WHERE id = ?`, [id]);
        }

        return plan;
    } catch (error) {
        console.error('Failed to ensure care plan:', error);
        return null;
    }
}

export async function createCarePlanTask(carePlanId: string, formData: FormData) {
    const user = await getCurrentUser();
    if (!user) return { error: 'Unauthorized' };

    try {
        const taskName = formData.get('taskName') as string;
        const category = formData.get('category') as string;
        const frequency = formData.get('frequency') as string;

        const id = sql.id();

        sql.run(`
            INSERT INTO CarePlanTask (id, carePlanId, taskName, category, frequency)
            VALUES (?, ?, ?, ?, ?)
        `, [id, carePlanId, taskName, category, frequency]);

        revalidatePath('/dashboard/crm');
        return { success: true };
    } catch (error) {
        console.error('Failed to create care plan task:', error);
        return { error: 'Failed to create task' };
    }
}

export async function saveCarePlan(contactId: string, title: string, tasks: any[]) {
    const user = await getCurrentUser();
    if (!user) return { error: 'Unauthorized' };

    try {
        // Find or create plan
        let plan: any = sql.get(`SELECT * FROM CarePlan WHERE contactId = ? AND status = 'ACTIVE'`, [contactId]);
        const now = sql.now();

        if (plan) {
            // Update title
            sql.run(`UPDATE CarePlan SET title = ?, updatedAt = ? WHERE id = ?`, [title, now, plan.id]);
        } else {
            const id = sql.id();
            sql.run(`
                INSERT INTO CarePlan (id, contactId, organizationId, title, status, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, 'ACTIVE', ?, ?)
            `, [id, contactId, user.organizationId, title, now, now]);
            plan = { id };
        }

        // Replace tasks
        // Note: In a real app we might want to be smarter about this (diffing), but replacement is safe for this prototype
        sql.run(`DELETE FROM CarePlanTask WHERE carePlanId = ?`, [plan.id]);

        const insertStmt = db.prepare(`INSERT INTO CarePlanTask (id, carePlanId, taskName, category, frequency) VALUES (?, ?, ?, ?, ?)`);

        const transaction = db.transaction((taskList: any[]) => {
            for (const task of taskList) {
                insertStmt.run(crypto.randomUUID(), plan.id, task.taskName, task.category, 'Daily'); // Default frequency if not provided
            }
        });

        transaction(tasks);

        revalidatePath('/dashboard/crm');
        return { success: true };
    } catch (error) {
        console.error('Failed to save care plan:', error);
        return { error: 'Failed to save care plan' };
    }
}

export async function createClient(data: FormData) {
    const contactData: any = {};
    data.forEach((value, key) => {
        contactData[key] = value;
    });

    // Ensure status is LEAD for intake
    if (!contactData.status) {
        contactData.status = 'LEAD';
    }

    return createContact(contactData);
}

export async function exportLeadsAction() {
    const user = await getCurrentUser();
    if (!user) return { error: 'Unauthorized' };

    try {
        const leads = await getContacts();
        if (!leads || leads.length === 0) {
            return { error: 'No leads to export' };
        }

        const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Company', 'Status'];
        const rows = leads.map((lead: any) => [
            lead.firstName,
            lead.lastName,
            lead.email,
            lead.phone,
            lead.company,
            lead.status
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell || ''}"`).join(','))
        ].join('\n');

        return { data: csvContent };
    } catch (error) {
        console.error('Failed to export leads:', error);
        return { error: 'Failed to export leads' };
    }
}
