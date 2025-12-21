'use server';

import { sql } from '@/lib/db-sql';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getOrganizationUsers() {
    const currentUser = await getCurrentUser();

    if (!currentUser.organizationId) {
        throw new Error('User does not belong to an organization');
    }

    // Isolate: Only fetch users from the same organization
    return sql.all<any>(`
        SELECT * FROM User 
        WHERE organizationId = ? 
        ORDER BY createdAt DESC
    `, [currentUser.organizationId]);
}

export async function getUser(id: string) {
    const currentUser = await getCurrentUser();
    if (!currentUser.organizationId) return null;

    const user = sql.get<any>(`
        SELECT * FROM User 
        WHERE id = ? AND organizationId = ?
    `, [id, currentUser.organizationId]);

    if (user) {
        user.documents = sql.all(`SELECT * FROM Document WHERE userId = ?`, [user.id]);
        user.certifications = sql.all(`SELECT * FROM Certification WHERE userId = ?`, [user.id]);
    }

    return user;
}

export async function uploadEmployeeDocument(userId: string, formData: FormData) {
    const currentUser = await getCurrentUser();

    // In a real app, we would upload the file to storage (S3/Blob) here.
    // For this demo, we will just create a Document record.
    const type = formData.get('type') as string; // W2, I9
    const name = `${type}_${new Date().getFullYear()}.pdf`;

    try {
        const id = sql.id();
        const now = sql.now();
        sql.run(`
            INSERT INTO Document (id, name, type, size, userId, organizationId, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [id, name, 'application/pdf', 1024, userId, currentUser.organizationId, now, now]);

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
        const id = sql.id();
        const now = sql.now();
        sql.run(`
            INSERT INTO User (id, email, name, role, organizationId, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [id, email, name, role, currentUser.organizationId, now, now]);

        revalidatePath('/dashboard/admin');
        return { success: true };
    } catch (error) {
        console.error('Failed to create user:', error);
        return { error: 'Failed to create user. Email might be in use.' };
    }
}
