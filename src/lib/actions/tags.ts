'use server';

import { sql } from '@/lib/db-sql';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getTags() {
    const user = await getCurrentUser();
    if (!user) return [];

    try {
        return sql.all(`SELECT * FROM Tag WHERE organizationId = ? ORDER BY name ASC`, [user.organizationId]);
    } catch (error) {
        console.error('Failed to fetch tags:', error);
        return [];
    }
}

export async function createTag(name: string, color: string = '#3b82f6') {
    const user = await getCurrentUser();
    if (!user) return { error: 'Unauthorized' };

    try {
        const id = sql.id();
        sql.run(`
            INSERT INTO Tag (id, name, color, organizationId, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [id, name, color, user.organizationId, sql.now(), sql.now()]);

        revalidatePath('/dashboard/crm');
        return { success: true, tag: { id, name, color } };
    } catch (error) {
        console.error('Failed to create tag:', error);
        return { error: 'Failed to create tag' };
    }
}

export async function addTagToContact(contactId: string, tagId: string) {
    try {
        sql.run(`INSERT OR IGNORE INTO ContactTag (contactId, tagId) VALUES (?, ?)`, [contactId, tagId]);
        revalidatePath('/dashboard/crm');
        revalidatePath('/dashboard/phone');
        return { success: true };
    } catch (error) {
        console.error('Failed to add tag:', error);
        return { error: 'Failed to add tag' };
    }
}

export async function removeTagFromContact(contactId: string, tagId: string) {
    try {
        sql.run(`DELETE FROM ContactTag WHERE contactId = ? AND tagId = ?`, [contactId, tagId]);
        revalidatePath('/dashboard/crm');
        revalidatePath('/dashboard/phone');
        return { success: true };
    } catch (error) {
        console.error('Failed to remove tag:', error);
        return { error: 'Failed to remove tag' };
    }
}

export async function addTagToUser(userId: string, tagId: string) {
    try {
        sql.run(`INSERT OR IGNORE INTO UserTag (userId, tagId) VALUES (?, ?)`, [userId, tagId]);
        revalidatePath('/dashboard/admin');
        return { success: true };
    } catch (error) {
        console.error('Failed to add tag to user:', error);
        return { error: 'Failed to add tag to user' };
    }
}

export async function removeTagFromUser(userId: string, tagId: string) {
    try {
        sql.run(`DELETE FROM UserTag WHERE userId = ? AND tagId = ?`, [userId, tagId]);
        revalidatePath('/dashboard/admin');
        return { success: true };
    } catch (error) {
        console.error('Failed to remove tag from user:', error);
        return { error: 'Failed to remove tag from user' };
    }
}

export async function getUserTags(userId: string) {
    try {
        return sql.all(`
            SELECT t.* FROM Tag t
            JOIN UserTag ut ON ut.tagId = t.id
            WHERE ut.userId = ?
        `, [userId]);
    } catch (error) {
        console.error('Failed to fetch user tags:', error);
        return [];
    }
}

