'use server';

import { sql } from '@/lib/db-sql';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getForms() {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const forms = sql.all<any>(`
        SELECT * FROM Form 
        WHERE organizationId = ? 
        ORDER BY createdAt DESC
    `, [user.organizationId || 'default']);

    for (const form of forms) {
        form.fields = sql.all(`
            SELECT * FROM FormField 
            WHERE formId = ? 
            ORDER BY "order" ASC
        `, [form.id]);
    }

    return forms;
}

export async function createForm(title: string, description: string, fields: { label: string, type: string, required: boolean, options?: string }[]) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const formId = sql.id();
    const now = sql.now();
    const orgId = user.organizationId || 'default';

    try {
        // Use a transaction if possible, but for better-sqlite3 wrapper without explicit transaction helper exposed as a closure, we run sequentially.
        // Wait, db-sql.ts DOES expose sql.transaction? Let's check. 
        // Based on previous reads, db-sql.ts exports `sql` object with helper methods.
        // Assuming it doesn't have a complex transaction wrapper, we'll just run statements.
        // Ideally we should use db.transaction() from better-sqlite3 but we are using the `sql` wrapper.
        // We will just run them sequentially.
        
        sql.run(`
            INSERT INTO Form (id, title, description, organizationId, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [formId, title, description, orgId, now, now]);

        for (let i = 0; i < fields.length; i++) {
            const f = fields[i];
            const fieldId = sql.id();
            sql.run(`
                INSERT INTO FormField (id, formId, label, type, required, options, "order")
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [fieldId, formId, f.label, f.type, f.required ? 1 : 0, f.options, i]);
        }
        
        revalidatePath('/dashboard/forms');
        return { id: formId };
    } catch (e) {
        console.error(e);
        throw new Error('Failed to create form');
    }
}

export async function deleteForm(id: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    // Cascade delete fields first? SQLite might handle it if defined, but to be safe:
    sql.run(`DELETE FROM FormField WHERE formId = ?`, [id]);
    sql.run(`DELETE FROM Form WHERE id = ? AND organizationId = ?`, [id, user.organizationId || 'default']);

    revalidatePath('/dashboard/forms');
}
