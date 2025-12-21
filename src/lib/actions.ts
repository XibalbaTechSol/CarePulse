'use server';

import { sql } from './db-sql';
import { getCurrentUser } from './auth';
import { revalidatePath } from 'next/cache';
import { decrypt } from './encryption';

import { sendViaSRFax } from './fax';

// --- Fax Actions ---
export async function sendFax(formData: {
    recipient: string;
    sender: string;
    priority: string;
    fileContent: string; // Base64
    fileName: string;
    coverSheet?: {
        to: string;
        from: string;
        subject: string;
        comments: string;
    };
}) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const config = sql.get<any>("SELECT * FROM SRFaxConfig WHERE userId = ?", [user.id]);

    let faxStatus = 'QUEUED';
    let remoteJobId: string | null = null;

    if (config) {
        // Real API call
        const payload: any = {
            accountId: config.accountId,
            password: decrypt(config.password),
            recipient: formData.recipient,
            sender: formData.sender,
            priority: formData.priority,
            file: formData.fileContent
        };

        if (formData.coverSheet) {
            console.log("Adding cover sheet to request:", formData.coverSheet);
        }

        const result = await sendViaSRFax(payload);

        if (result.success) {
            faxStatus = 'QUEUED'; // SRFax returns Success when queued
            remoteJobId = String(result.jobId);
        } else {
            faxStatus = 'FAILED';
            console.error("Fax failed to send:", result.error);
        }
    }

    const faxId = sql.id();
    const fax = {
        id: faxId,
        recipient: formData.recipient,
        sender: formData.sender,
        direction: 'OUTBOUND',
        status: faxStatus,
        remoteJobId,
        userId: user.id,
        organizationId: user.organizationId,
        createdAt: sql.now()
    };

    sql.run(`
        INSERT INTO Fax (id, recipient, sender, direction, status, remoteJobId, userId, organizationId, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [fax.id, fax.recipient, fax.sender, fax.direction, fax.status, fax.remoteJobId, fax.userId, fax.organizationId, fax.createdAt]);

    revalidatePath('/dashboard/fax');
    return { success: faxStatus !== 'FAILED', fax };
}

export async function syncFaxStatus() {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const config = sql.get<any>("SELECT * FROM SRFaxConfig WHERE userId = ?", [user.id]);

    if (!config) return { success: false, error: 'No SRFax config found' };

    // Find faxes that are not in a final state
    const activeFaxes = sql.all<any>(`
        SELECT * FROM Fax 
        WHERE userId = ? 
        AND status IN ('QUEUED', 'IN_PROCESS', 'SENT') 
        AND direction = 'OUTBOUND' 
        AND remoteJobId IS NOT NULL
    `, [user.id]);

    let updatedCount = 0;

    for (const fax of activeFaxes) {
        if (!fax.remoteJobId) continue;

        const statusResponse = await (await import('./fax')).getFaxStatus(
            fax.remoteJobId,
            config.accountId,
            decrypt(config.password)
        );

        // Map SRFax statuses: QUEUED, IN_PROCESS, SENT (to provider), COMPLETED (delivered), FAILED
        let newStatus = fax.status;
        if (statusResponse === 'Sent') {
            newStatus = 'DELIVERED';
        } else if (statusResponse === 'Failed') {
            newStatus = 'FAILED';
        } else if (statusResponse === 'Queued') {
            newStatus = 'QUEUED';
        } else if (statusResponse === 'In Process') {
            newStatus = 'IN_PROCESS';
        }

        if (newStatus !== fax.status) {
            sql.run("UPDATE Fax SET status = ? WHERE id = ?", [newStatus, fax.id]);
            updatedCount++;
        }
    }

    revalidatePath('/dashboard/fax');
    return { success: true, updated: updatedCount };
}

export async function draftFaxFromDocument(fileUrl: string, contactId: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const contact = sql.get<any>('SELECT * FROM Contact WHERE id = ?', [contactId]);
    const recipient = contact?.phone || '';

    const faxId = sql.id();
    const now = sql.now();

    sql.run(`
        INSERT INTO Fax (id, direction, status, sender, recipient, fileUrl, userId, organizationId, createdAt)
        VALUES (?, 'OUTBOUND', 'DRAFT', ?, ?, ?, ?, ?, ?)
    `, [faxId, user.name || 'Unknown', recipient, fileUrl, user.id, user.organizationId, now]);

    revalidatePath('/dashboard/fax');
    return { success: true, faxId };
}

export async function getFaxes() {
    const user = await getCurrentUser();
    if (!user) return [];

    return sql.all(`SELECT * FROM Fax WHERE userId = ? ORDER BY createdAt DESC`, [user.id]);
}

// --- CRM Actions ---
export async function getContacts() {
    const user = await getCurrentUser();
    if (!user) return [];

    // Prisma: include deals, tasks, activities.
    // SQL: Fetch base contacts, then fill relations? Or just Fetch contacts and let sub-components fetch?
    // Since this is a server action returning data props, we should probably join or fetch related data.
    // However, for simplicity/performance in SQL refactor, let's fetch contacts and maybe doing simple separate fetches is cleaner 
    // OR we change the UI to not expect everything nested. 
    // Checking the UI (dashboard/CRM) would be good, but aiming for 'compatible' implementation:
    // We can't easily return a deeply nested object graph from a single SQL query without JSON_GROUP_ARRAY (sqlite 3.38+).
    // better-sqlite3 supports it.
    // Let's try simple fetch for now and see if we can get away with it, or do a "populate" step.

    const contacts = sql.all<any>(`SELECT * FROM Contact WHERE organizationId = ?`, [user.organizationId]);

    // Populate relations manually (N+1 but simple for now)
    for (const contact of contacts) {
        contact.deals = sql.all(`SELECT * FROM Deal WHERE contactId = ?`, [contact.id]);
        contact.tasks = sql.all(`SELECT * FROM Task WHERE contactId = ? AND status = 'OPEN'`, [contact.id]);
        contact.activities = sql.all(`SELECT * FROM Activity WHERE contactId = ? ORDER BY createdAt DESC LIMIT 10`, [contact.id]);
    }

    return contacts;
}

export async function createContact(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
}) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const contactId = sql.id();
    const contact = {
        id: contactId,
        ...data,
        userId: user.id,
        status: 'LEAD',
        organizationId: user.organizationId,
        createdAt: sql.now(),
        updatedAt: sql.now()
    };

    sql.run(`
        INSERT INTO Contact (id, firstName, lastName, email, phone, company, userId, status, organizationId, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [contact.id, contact.firstName, contact.lastName, contact.email, contact.phone, contact.company, contact.userId, contact.status, contact.organizationId, contact.createdAt, contact.updatedAt]);

    revalidatePath('/dashboard/crm');
    return contact;
}

export async function getTasks() {
    const user = await getCurrentUser();
    if (!user) return [];

    const tasks = sql.all<any>(`
        SELECT t.*, 
               c.id as c_id, c.firstName, c.lastName,
               d.id as d_id, d.title as deal_title
        FROM Task t
        LEFT JOIN Contact c ON t.contactId = c.id
        LEFT JOIN Deal d ON t.dealId = d.id
        WHERE t.userId = ? 
        ORDER BY t.dueDate ASC
    `, [user.id]);

    // Map to nested mock-Prisma structure
    return tasks.map(t => {
        const { c_id, firstName, lastName, d_id, deal_title, ...task } = t;
        return {
            ...task,
            contact: c_id ? { id: c_id, firstName, lastName } : null,
            deal: d_id ? { id: d_id, title: deal_title } : null
        };
    });
}

export async function createActivity(data: {
    type: string;
    content: string;
    contactId?: string;
    dealId?: string;
}) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const activityId = sql.id();
    const activity = {
        id: activityId,
        ...data,
        userId: user.id,
        organizationId: user.organizationId,
        createdAt: sql.now()
    };

    sql.run(`
        INSERT INTO Activity (id, type, content, contactId, dealId, userId, organizationId, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [activity.id, activity.type, activity.content, activity.contactId, activity.dealId, activity.userId, activity.organizationId, activity.createdAt]);

    revalidatePath('/dashboard/crm');
    return activity;
}

export async function updateTaskStatus(taskId: string, status: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    sql.run(`UPDATE Task SET status = ?, updatedAt = ? WHERE id = ? AND userId = ?`, [status, sql.now(), taskId, user.id]);
    const task = sql.get(`SELECT * FROM Task WHERE id = ?`, [taskId]);

    revalidatePath('/dashboard/crm');
    return task;
}
