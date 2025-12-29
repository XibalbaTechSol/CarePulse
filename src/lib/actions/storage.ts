'use server';

import { sql } from '../db-sql';
import { getCurrentUser } from '../auth';
import { revalidatePath } from 'next/cache';

export async function getDocuments(parentId: string | null = null, starredOnly: boolean = false) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    let query = `
        SELECT * FROM Document 
        WHERE organizationId = ? 
    `;
    const params: any[] = [user.organizationId];

    if (starredOnly) {
        query += " AND isStarred = 1";
    } else {
        if (parentId) {
            query += " AND parentId = ?";
            params.push(parentId);
        } else {
            query += " AND parentId IS NULL";
        }
    }

    query += " ORDER BY isFolder DESC, name ASC";

    return sql.all<any>(query, params);
}

export async function createFolder(name: string, parentId: string | null = null, contactId: string | null = null) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const id = sql.id();
    const now = sql.now();

    sql.run(`
        INSERT INTO Document (id, name, type, isFolder, parentId, userId, contactId, organizationId, createdAt, updatedAt)
        VALUES (?, ?, 'FOLDER', 1, ?, ?, ?, ?, ?, ?)
    `, [id, name, parentId, user.id, contactId, user.organizationId, now, now]);

    revalidatePath('/dashboard/storage');
    return { id, name };
}

export async function deleteDocument(id: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    // Recursive delete for folders might be needed, but for simplicity let's do a single level check
    const doc = sql.get<any>("SELECT * FROM Document WHERE id = ?", [id]);
    if (doc?.isFolder) {
        // Find children
        const children = sql.all<any>("SELECT id FROM Document WHERE parentId = ?", [id]);
        for (const child of children) {
            await deleteDocument(child.id);
        }
    }

    sql.run("DELETE FROM Document WHERE id = ? AND organizationId = ?", [id, user.organizationId]);
    revalidatePath('/dashboard/storage');
}

export async function toggleStar(id: string, isStarred: boolean) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    sql.run("UPDATE Document SET isStarred = ? WHERE id = ? AND organizationId = ?", [isStarred ? 1 : 0, id, user.organizationId]);
    revalidatePath('/dashboard/storage');
}

export async function ensureEntityFolders() {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const categories = ['Patients', 'Clients', 'Employees'];
    const categoryIds: Record<string, string> = {};

    for (const cat of categories) {
        let folder = sql.get<any>(`
            SELECT id FROM Document 
            WHERE name = ? AND parentId IS NULL AND isFolder = 1 AND organizationId = ?
        `, [cat, user.organizationId]);

        if (!folder) {
            const id = sql.id();
            const now = sql.now();
            sql.run(`
                INSERT INTO Document (id, name, type, isFolder, parentId, userId, organizationId, createdAt, updatedAt)
                VALUES (?, ?, 'FOLDER', 1, NULL, ?, ?, ?, ?)
            `, [id, cat, user.id, user.organizationId, now, now]);
            categoryIds[cat] = id;
        } else {
            categoryIds[cat] = folder.id;
        }
    }

    // Patients & Clients are both in Contact table but we can distinguish by status or just populate both
    // Actually Patient is often a specific status or implicit. Let's look at schema again.
    // Contact has status LEAD, CUSTOMER, PARTNER.
    // For this context, let's treat CUSTOMER as Client.

    const contacts = sql.all<any>("SELECT id, firstName, lastName, status FROM Contact WHERE organizationId = ?", [user.organizationId]);
    for (const contact of contacts) {
        const folderName = `${contact.firstName} ${contact.lastName}`;
        const parentId = contact.status === 'CUSTOMER' ? categoryIds['Clients'] : categoryIds['Patients'];

        let folder = sql.get<any>(`
            SELECT id FROM Document 
            WHERE contactId = ? AND parentId = ? AND isFolder = 1
        `, [contact.id, parentId]);

        if (!folder) {
            const id = sql.id();
            const now = sql.now();
            sql.run(`
                INSERT INTO Document (id, name, type, isFolder, parentId, userId, contactId, organizationId, createdAt, updatedAt)
                VALUES (?, ?, 'FOLDER', 1, ?, ?, ?, ?, ?, ?)
            `, [id, folderName, parentId, user.id, contact.id, user.organizationId, now, now]);
        }
    }

    // Employees are Users
    const employees = sql.all<any>("SELECT id, name FROM User WHERE organizationId = ?", [user.organizationId]);
    for (const emp of employees) {
        const folderName = emp.name || 'Unnamed Employee';
        const parentId = categoryIds['Employees'];

        let folder = sql.get<any>(`
            SELECT id FROM Document 
            WHERE name = ? AND parentId = ? AND isFolder = 1
        `, [folderName, parentId]);

        // Note: For employees, we don't have a specific column in Document for 'entityUserId' 
        // but we can use name or add a column if needed. For now let's use name inside Employees folder.
        if (!folder) {
            const id = sql.id();
            const now = sql.now();
            sql.run(`
                INSERT INTO Document (id, name, type, isFolder, parentId, userId, organizationId, createdAt, updatedAt)
                VALUES (?, ?, 'FOLDER', 1, ?, ?, ?, ?, ?)
            `, [id, folderName, parentId, user.id, user.organizationId, now, now]);
        }
    }

    revalidatePath('/dashboard/storage');
}

export async function uploadFile(formData: FormData) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const file = formData.get('file') as File;
    const parentId = formData.get('parentId') as string | null;

    if (!file) throw new Error('No file provided');

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name;
    const fileType = file.type || 'application/octet-stream';

    const { join } = await import('path');
    const { existsSync, mkdirSync, writeFileSync } = await import('fs');

    const uploadDir = join(process.cwd(), 'public/uploads');
    if (!existsSync(uploadDir)) {
        mkdirSync(uploadDir, { recursive: true });
    }

    // Identify if we are in a contact folder to link the document automatically
    let contactId: string | null = null;
    if (parentId && parentId !== 'null' && parentId !== null) {
        const parent = sql.get<any>("SELECT contactId FROM Document WHERE id = ?", [parentId]);
        contactId = parent?.contactId || null;
    }

    const id = sql.id();
    const now = sql.now();
    const filePath = join(uploadDir, `${id}_${fileName}`);
    const fileUrl = `/uploads/${id}_${fileName}`;

    writeFileSync(filePath, buffer);

    sql.run(`
        INSERT INTO Document (id, name, fileUrl, type, size, isFolder, parentId, userId, contactId, organizationId, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?)
    `, [id, fileName, fileUrl, fileType, buffer.length, (parentId === 'null' || !parentId) ? null : parentId, user.id, contactId, user.organizationId, now, now]);

    revalidatePath('/dashboard/storage');
    return { success: true, id, name: fileName };
}
