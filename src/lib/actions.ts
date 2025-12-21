'use server';

import { prisma } from './db';
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

    const config = await (prisma as any).sRFaxConfig.findUnique({
        where: { userId: user.id }
    });

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

    const fax = await prisma.fax.create({
        data: {
            recipient: formData.recipient,
            sender: formData.sender,
            direction: 'OUTBOUND',
            status: faxStatus,
            remoteJobId,
            userId: user.id,
            organizationId: user.organizationId
        }
    });

    revalidatePath('/dashboard/fax');
    return { success: faxStatus !== 'FAILED', fax };
}

export async function syncFaxStatus() {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const config = await (prisma as any).sRFaxConfig.findUnique({
        where: { userId: user.id }
    });

    if (!config) return { success: false, error: 'No SRFax config found' };

    // Find faxes that are not in a final state
    const activeFaxes = await (prisma.fax as any).findMany({
        where: {
            userId: user.id,
            status: { in: ['QUEUED', 'IN_PROCESS', 'SENT'] },
            direction: 'OUTBOUND',
            remoteJobId: { not: null }
        }
    });

    let updatedCount = 0;

    for (const fax of activeFaxes) {
        if (!fax.remoteJobId) continue;

        const statusResponse = await (await import('./fax')).getFaxStatus(
            (fax as any).remoteJobId,
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
            await prisma.fax.update({
                where: { id: fax.id },
                data: { status: newStatus }
            });
            updatedCount++;
        }
    }

    revalidatePath('/dashboard/fax');
    return { success: true, updated: updatedCount };
}

export async function getFaxes() {
    const user = await getCurrentUser();
    if (!user) return [];

    return prisma.fax.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
    });
}

// --- CRM Actions ---
export async function getContacts() {
    const user = await getCurrentUser();
    if (!user) return [];

    return prisma.contact.findMany({
        where: { organizationId: user.organizationId },
        include: {
            deals: true,
            tasks: { where: { status: 'OPEN' } },
            activities: { take: 10, orderBy: { createdAt: 'desc' } }
        }
    });
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

    const contact = await prisma.contact.create({
        data: {
            ...data,
            userId: user.id,
            status: 'LEAD', // Default status
            organizationId: user.organizationId
        }
    });

    revalidatePath('/dashboard/crm');
    return contact;
}

export async function getTasks() {
    const user = await getCurrentUser();
    if (!user) return [];

    return prisma.task.findMany({
        where: { userId: user.id },
        include: { contact: true, deal: true },
        orderBy: { dueDate: 'asc' }
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

    const activity = await prisma.activity.create({
        data: {
            ...data,
            userId: user.id,
            organizationId: user.organizationId
        }
    });
    revalidatePath('/dashboard/crm');
    return activity;
}

export async function updateTaskStatus(taskId: string, status: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const task = await prisma.task.update({
        where: { id: taskId, userId: user.id },
        data: { status }
    });
    revalidatePath('/dashboard/crm');
    return task;
}
