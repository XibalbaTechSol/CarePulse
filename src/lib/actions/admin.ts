'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getOrganizationUsers() {
    const currentUser = await getCurrentUser();

    if (!currentUser.organizationId) {
        throw new Error('User does not belong to an organization');
    }

    // Isolate: Only fetch users from the same organization
    return await prisma.user.findMany({
        where: {
            organizationId: currentUser.organizationId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
}

export async function getUser(id: string) {
    const currentUser = await getCurrentUser();
    if (!currentUser.organizationId) return null;

    return await prisma.user.findFirst({
        where: {
            id,
            organizationId: currentUser.organizationId
        },
        include: {
            documents: true,
            certifications: true
        }
    });
}

export async function uploadEmployeeDocument(userId: string, formData: FormData) {
    const currentUser = await getCurrentUser();

    // In a real app, we would upload the file to storage (S3/Blob) here.
    // For this demo, we will just create a Document record.
    const type = formData.get('type') as string; // W2, I9
    const name = `${type}_${new Date().getFullYear()}.pdf`;

    try {
        await prisma.document.create({
            data: {
                name,
                type: 'application/pdf',
                size: 1024, // Mock size
                userId,
                organizationId: currentUser.organizationId
            }
        });
        revalidatePath(`/dashboard/admin/users/${userId}`);
        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: 'Failed to upload document' };
    }
}

export async function createUserAction(formData: FormData) {
    const currentUser = await getCurrentUser();

    // Only ADMINs can add users (simple check)
    if (currentUser.role !== 'ADMIN') {
        return { error: 'Unauthorized' };
    }

    if (!currentUser.organizationId) {
        return { error: 'Organization not found' };
    }

    const email = formData.get('email') as string;
    const name = formData.get('name') as string;
    const role = formData.get('role') as string || 'USER';

    try {
        await prisma.user.create({
            data: {
                email,
                name,
                role,
                organizationId: currentUser.organizationId
            }
        });
        revalidatePath('/dashboard/admin');
        return { success: true };
    } catch (error) {
        console.error('Failed to create user:', error);
        return { error: 'Failed to create user. Email might be in use.' };
    }
}
