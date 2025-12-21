'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { encrypt } from '@/lib/encryption';

export async function getModuleConfigAction(organizationId: string) {
    try {
        const data = await prisma.moduleConfig.findUnique({
            where: { organizationId }
        });
        return { data };
    } catch {
        return { error: 'Failed to fetch module config' };
    }
}

export async function updateModuleConfigAction(id: string, data: any) {
    try {
        const updated = await prisma.moduleConfig.update({
            where: { id },
            data,
        });
        revalidatePath('/dashboard');
        return { data: updated };
    } catch {
        return { error: 'Failed to update module config' };
    }
}

export async function saveEmailAccountAction(userId: string, data: any) {
    try {
        const encryptedData = { ...data };
        if (data.password) {
            encryptedData.password = encrypt(data.password);
        }

        const account = await prisma.emailAccount.upsert({
            where: { userId },
            update: encryptedData,
            create: {
                ...encryptedData,
                userId
            }
        });
        revalidatePath('/dashboard/email');
        return { data: account };
    } catch {
        return { error: 'Failed to save email account' };
    }
}

export async function saveSipAccountAction(userId: string, data: any) {
    try {
        const encryptedData = { ...data };
        if (data.password) {
            encryptedData.password = encrypt(data.password);
        }

        const account = await prisma.sipAccount.upsert({
            where: { userId },
            update: encryptedData,
            create: {
                ...encryptedData,
                userId
            }
        });
        revalidatePath('/dashboard/phone');
        return { data: account };
    } catch {
        return { error: 'Failed to save SIP account' };
    }
}
export async function saveSRFaxConfigAction(userId: string, data: any) {
    try {
        const encryptedData = { ...data };
        if (data.password) {
            encryptedData.password = encrypt(data.password);
        }

        const config = await prisma.sRFaxConfig.upsert({
            where: { userId },
            update: encryptedData,
            create: {
                ...encryptedData,
                userId
            }
        });
        revalidatePath('/dashboard/fax');
        return { data: config };
    } catch {
        return { error: 'Failed to save SRFax configuration' };
    }
}

export async function saveDashboardLayoutAction(organizationId: string, layout: string) {
    try {
        await prisma.moduleConfig.update({
            where: { organizationId },
            data: { dashboardLayout: layout }
        });
        revalidatePath('/dashboard');
        return { success: true };
    } catch {
        return { error: 'Failed to save dashboard layout' };
    }
}
