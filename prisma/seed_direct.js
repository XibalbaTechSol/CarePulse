import BetterSqlite3 from 'better-sqlite3';

async function seed() {
    const db = new BetterSqlite3('prisma/dev.db');
    db.pragma('foreign_keys = OFF');

    try {
        // Create Organization
        const orgId = 'org_demo';
        db.prepare('INSERT OR IGNORE INTO Organization (id, name, domain, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)').run(
            orgId, 'Nextiva Clone Org', 'nextiva-clone.io', new Date().toISOString(), new Date().toISOString()
        );

        // Find or Create Org
        const org = db.prepare('SELECT id FROM Organization WHERE domain = ?').get('nextiva-clone.io');

        // Create ModuleConfig
        db.prepare(`
            INSERT OR REPLACE INTO ModuleConfig (id, organizationId, crmEnabled, emailEnabled, voipEnabled, faxEnabled, storageEnabled, evvEnabled, payrollEnabled, auditEnabled, formsEnabled)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            'config_' + org.id, org.id, 1, 1, 1, 1, 1, 1, 1, 1, 1
        );

        // Create User
        const userId = 'user_demo';
        db.prepare('DELETE FROM Contact WHERE userId = ?').run(userId);
        db.prepare('DELETE FROM EmailAccount WHERE userId = ?').run(userId);

        db.prepare(`
            INSERT OR IGNORE INTO User (id, email, name, role, organizationId, createdAt, updatedAt) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(
            userId, 'demo@example.com', 'Demo Admin', 'ADMIN', org.id, new Date().toISOString(), new Date().toISOString()
        );

        db.prepare('UPDATE User SET organizationId = ?, role = ? WHERE id = ?').run(org.id, 'ADMIN', userId);

        // Create EmailAccount
        db.prepare(`
            INSERT OR REPLACE INTO EmailAccount (id, userId, username, password, imapHost, imapPort, smtpHost, smtpPort, isActive, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            'email_' + userId, userId, 'demo@example.com', 'password', 'imap.example.com', 993, 'smtp.example.com', 587, 0, new Date().toISOString(), new Date().toISOString()
        );

        // Create Contacts
        const contacts = [
            { id: 'c1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '555-0101', company: 'Tech Corp', status: 'CUSTOMER' },
            { id: 'c2', firstName: 'Jane', lastName: 'Smith', email: 'jane@smith.io', phone: '555-0102', company: 'Innovation Inc', status: 'LEAD' },
        ];

        for (const c of contacts) {
            db.prepare(`
                INSERT OR REPLACE INTO Contact (id, firstName, lastName, email, phone, company, status, userId, organizationId, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).run(
                c.id, c.firstName, c.lastName, c.email, c.phone, c.company, c.status, userId, org.id, new Date().toISOString(), new Date().toISOString()
            );

            // Create Deal
            db.prepare(`
                INSERT OR REPLACE INTO Deal (id, title, value, stage, contactId, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `).run(
                'deal_' + c.id, `${c.company} Expansion`, 25000, 'QUALIFICATION', c.id, new Date().toISOString(), new Date().toISOString()
            );

            // Create Task
            db.prepare(`
                INSERT OR REPLACE INTO Task (id, title, status, priority, userId, contactId, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `).run(
                'task_' + c.id, `Follow up with ${c.firstName}`, 'OPEN', 'HIGH', userId, c.id, new Date().toISOString(), new Date().toISOString()
            );

            // Create Activity
            db.prepare(`
                INSERT OR REPLACE INTO Activity (id, type, content, userId, contactId, createdAt)
                VALUES (?, ?, ?, ?, ?, ?)
            `).run(
                'act_' + c.id, 'NOTE', `Initial contact made with ${c.firstName} from ${c.company}`, userId, c.id, new Date().toISOString()
            );
        }

        console.log('Direct seed completed successfully via better-sqlite3');
    } catch (error) {
        console.error('Seed Error:', error);
    } finally {
        db.close();
    }
}

seed();
