'use server';

import { sql } from '@/lib/db-sql';
import { revalidatePath } from 'next/cache';
import { encrypt } from '@/lib/encryption';

export async function getModuleConfigAction(organizationId: string) {
    try {
        const data = sql.get<any>(`SELECT * FROM ModuleConfig WHERE organizationId = ?`, [organizationId]);
        return { data };
    } catch {
        return { error: 'Failed to fetch module config' };
    }
}

export async function updateModuleConfigAction(id: string, data: any) {
    try {
        // Dynamic update query
        const keys = Object.keys(data).filter(k => k !== 'id');
        if (keys.length === 0) return { data: null };

        const setClause = keys.map(k => `${k} = ?`).join(', ');
        const values = keys.map(k => data[k]);

        sql.run(`UPDATE ModuleConfig SET ${setClause} WHERE id = ?`, [...values, id]);

        const updated = sql.get(`SELECT * FROM ModuleConfig WHERE id = ?`, [id]);
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

        const existing = sql.get<any>(`SELECT id FROM EmailAccount WHERE userId = ?`, [userId]);
        const id = existing ? existing.id : sql.id();
        const now = sql.now();

        if (existing) {
            sql.run(`
                UPDATE EmailAccount 
                SET imapHost = ?, imapPort = ?, smtpHost = ?, smtpPort = ?, username = ?, password = ?, isActive = ?, updatedAt = ?
                WHERE id = ?
             `, [
                encryptedData.imapHost, encryptedData.imapPort, encryptedData.smtpHost, encryptedData.smtpPort, encryptedData.username, encryptedData.password, 1, now, id
            ]);
        } else {
            sql.run(`
                INSERT INTO EmailAccount (id, userId, imapHost, imapPort, smtpHost, smtpPort, username, password, isActive, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             `, [
                id, userId, encryptedData.imapHost, encryptedData.imapPort, encryptedData.smtpHost, encryptedData.smtpPort, encryptedData.username, encryptedData.password, 1, now, now
            ]);
        }

        const account = sql.get(`SELECT * FROM EmailAccount WHERE id = ?`, [id]);
        revalidatePath('/dashboard/email');
        return { data: account };
    } catch (e) {
        console.error(e);
        return { error: 'Failed to save email account' };
    }
}

export async function saveSipAccountAction(userId: string, data: any) {
    try {
        const encryptedData = { ...data };
        if (data.password) {
            encryptedData.password = encrypt(data.password);
        }

        const existing = sql.get<any>(`SELECT id FROM SipAccount WHERE userId = ?`, [userId]);
        const id = existing ? existing.id : sql.id();
        const now = sql.now();

        if (existing) {
            sql.run(`
                UPDATE SipAccount
                SET username = ?, password = ?, domain = ?, websocketUrl = ?, isActive = ?, updatedAt = ?
                WHERE id = ?
            `, [encryptedData.username, encryptedData.password, encryptedData.domain, encryptedData.websocketUrl, 1, now, id]);
        } else {
            sql.run(`
                INSERT INTO SipAccount (id, userId, username, password, domain, websocketUrl, isActive, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [id, userId, encryptedData.username, encryptedData.password, encryptedData.domain, encryptedData.websocketUrl, 1, now, now]);
        }

        const account = sql.get(`SELECT * FROM SipAccount WHERE id = ?`, [id]);
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

        const existing = sql.get<any>(`SELECT id FROM SRFaxConfig WHERE userId = ?`, [userId]);
        const id = existing ? existing.id : sql.id();
        const now = sql.now();

        if (existing) {
            sql.run(`
                UPDATE SRFaxConfig
                SET accountId = ?, password = ?, updatedAt = ?
                WHERE id = ?
            `, [encryptedData.accountId, encryptedData.password, now, id]);
        } else {
            sql.run(`
                INSERT INTO SRFaxConfig (id, userId, accountId, password, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [id, userId, encryptedData.accountId, encryptedData.password, now, now]);
        }

        const config = sql.get(`SELECT * FROM SRFaxConfig WHERE id = ?`, [id]);
        revalidatePath('/dashboard/fax');
        return { data: config };
    } catch {
        return { error: 'Failed to save SRFax configuration' };
    }
}

export async function saveDashboardLayoutAction(organizationId: string, layout: string) {
    try {
        sql.run(`UPDATE ModuleConfig SET dashboardLayout = ? WHERE organizationId = ?`, [layout, organizationId]);
        revalidatePath('/dashboard');
        return { success: true };
    } catch {
        return { error: 'Failed to save dashboard layout' };
    }
}
