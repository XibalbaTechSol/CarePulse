import { db, sql } from './db-sql';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
    console.log('Seeding database via src/lib/db-sql...');
    
    // Ensure foreign keys are on (db-sql might already do this but good to be sure)
    db.pragma('foreign_keys = OFF'); // Off for seeding to avoid ordering headaches, or ON if we want strictness.
    // The original seed_direct.js turned them OFF.

    try {
        // Create Organization
        const orgId = 'org_demo';
        // Check if exists
        const existingOrg = sql.get<any>("SELECT id FROM Organization WHERE domain = ?", ['nextiva-clone.io']);
        
        if (!existingOrg) {
            sql.run(`
                INSERT INTO Organization (id, name, domain, createdAt, updatedAt) 
                VALUES (?, ?, ?, ?, ?)
            `, [orgId, 'Nextiva Clone Org', 'nextiva-clone.io', new Date().toISOString(), new Date().toISOString()]);
        }

        const org = existingOrg || { id: orgId };

        // Create ModuleConfig
        sql.run(`
            INSERT OR REPLACE INTO ModuleConfig (id, organizationId, crmEnabled, emailEnabled, voipEnabled, faxEnabled, storageEnabled, evvEnabled, payrollEnabled, auditEnabled, formsEnabled)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, ['config_' + org.id, org.id, 1, 1, 1, 1, 1, 1, 1, 1, 1]);

        // Create User
        const userId = 'user_demo';
        
        // Clean up user data
        sql.run('DELETE FROM Contact WHERE userId = ?', [userId]);
        sql.run('DELETE FROM EmailAccount WHERE userId = ?', [userId]);

        sql.run(`
            INSERT OR IGNORE INTO User (id, email, name, role, organizationId, createdAt, updatedAt) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [userId, 'demo@example.com', 'Demo Admin', 'ADMIN', org.id, new Date().toISOString(), new Date().toISOString()]);

        sql.run('UPDATE User SET organizationId = ?, role = ? WHERE id = ?', [org.id, 'ADMIN', userId]);

        // Create EmailAccount
        sql.run(`
            INSERT OR REPLACE INTO EmailAccount (id, userId, username, password, imapHost, imapPort, smtpHost, smtpPort, isActive, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, ['email_' + userId, userId, 'demo@example.com', 'password', 'imap.example.com', 993, 'smtp.example.com', 587, 0, new Date().toISOString(), new Date().toISOString()]);

        // Create Contacts
        const contacts = [
            { id: 'c1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '555-0101', company: 'Tech Corp', status: 'CUSTOMER' },
            { id: 'c2', firstName: 'Jane', lastName: 'Smith', email: 'jane@smith.io', phone: '555-0102', company: 'Innovation Inc', status: 'LEAD' },
        ];

        for (const c of contacts) {
            sql.run(`
                INSERT OR REPLACE INTO Contact (id, firstName, lastName, email, phone, company, status, userId, organizationId, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [c.id, c.firstName, c.lastName, c.email, c.phone, c.company, c.status, userId, org.id, new Date().toISOString(), new Date().toISOString()]);

            // Create Deal
            sql.run(`
                INSERT OR REPLACE INTO Deal (id, title, value, stage, contactId, organizationId, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, ['deal_' + c.id, `${c.company} Expansion`, 25000, 'QUALIFICATION', c.id, org.id, new Date().toISOString(), new Date().toISOString()]);

            // Create Task
            sql.run(`
                INSERT OR REPLACE INTO Task (id, title, status, priority, userId, contactId, organizationId, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, ['task_' + c.id, `Follow up with ${c.firstName}`, 'OPEN', 'HIGH', userId, c.id, org.id, new Date().toISOString(), new Date().toISOString()]);

            // Create Activity
            sql.run(`
                INSERT OR REPLACE INTO Activity (id, type, content, userId, contactId, organizationId, createdAt)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, ['act_' + c.id, 'NOTE', `Initial contact made with ${c.firstName} from ${c.company}`, userId, c.id, org.id, new Date().toISOString()]);
        }

        console.log('Seed completed successfully via src/lib/seed.ts');
    } catch (error) {
        console.error('Seed Error:', error);
    } finally {
        // db.close(); // Shared db instance usually stays open, but for a script it's fine.
    }
}

seed();
