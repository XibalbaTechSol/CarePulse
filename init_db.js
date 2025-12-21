const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'dev.db');
const schemaPath = path.join(process.cwd(), 'src/lib/schema.sql');

console.log(`Initializing DB at ${dbPath}...`);
const db = new Database(dbPath);

try {
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    db.exec(schema);
    console.log('Schema applied.');

    // Seed Data
    const orgId = 'org_demo';
    db.prepare('INSERT OR IGNORE INTO Organization (id, name, domain) VALUES (?, ?, ?)').run(
        orgId, 'Demo Organization', 'demo.io'
    );

    const userId = 'user_demo';
    db.prepare(`
        INSERT OR IGNORE INTO User (id, email, name, role, organizationId) 
        VALUES (?, ?, ?, ?, ?)
    `).run(
        userId, 'demo@example.com', 'Demo User', 'ADMIN', orgId
    );

    db.prepare(`
        INSERT OR REPLACE INTO ModuleConfig (id, organizationId, formsEnabled, dashboardLayout)
        VALUES (?, ?, ?, ?)
    `).run(
        'config_' + orgId, orgId, 1, 'default'
    );
    
    // Add some contacts for Forms testing
    db.prepare(`
        INSERT OR IGNORE INTO Contact (id, firstName, lastName, userId, organizationId, dateOfBirth, address, city, state, zip)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run('c1', 'John', 'Doe', userId, orgId, '1980-01-01', '123 Main St', 'Madison', 'WI', '53703');

    db.prepare(`
        INSERT OR IGNORE INTO Contact (id, firstName, lastName, userId, organizationId, dateOfBirth, address, city, state, zip)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run('c2', 'Jane', 'Smith', userId, orgId, '1992-05-15', '456 Oak Ln', 'Milwaukee', 'WI', '53202');
    
    // Create CarePlan/Auth for c1
    db.prepare(`
        INSERT OR IGNORE INTO Authorization (id, contactId, organizationId, authNumber, serviceCode, startDate, endDate, totalUnits)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run('auth1', 'c1', orgId, 'AUTH123', 'T1019', '2024-01-01', '2024-12-31', 500);

    console.log('Seed data applied.');

} catch (err) {
    console.error('Error initializing DB:', err);
    process.exit(1);
} finally {
    db.close();
}
