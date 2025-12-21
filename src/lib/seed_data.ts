import { sql, db } from './db-sql';
import { encrypt } from './encryption';

async function seedData() {
    console.log('Starting seed...');

    // 1. Get or Create Organization
    let org = sql.get<any>("SELECT * FROM Organization WHERE domain = ?", ['acme.com']);
    if (!org) {
        const orgId = sql.id();
        sql.run("INSERT INTO Organization (id, name, domain) VALUES (?, ?, ?)", [orgId, 'Acme Corp', 'acme.com']);
        org = { id: orgId };
        console.log('Created Organization');
    }

    // 2. Add 5 Test Employees (Caregivers/Nurses)
    const roles = ['NURSE', 'CAREGIVER', 'OFFICE', 'USER', 'ADMIN'];
    for (let i = 1; i <= 5; i++) {
        const id = sql.id();
        const email = `employee${i}@acme.com`;
        const role = roles[i - 1];

        sql.run(`
            INSERT INTO User (id, email, name, role, organizationId, hourlyRate) 
            VALUES (?, ?, ?, ?, ?, ?)
        `, [id, email, `Employee ${i} (${role})`, role, org.id, 20 + i]);
        console.log(`Added Employee: ${email}`);
    }

    // 3. Add 10 Test Clients (Contacts)
    const agent = sql.get<any>("SELECT id FROM User WHERE organizationId = ? LIMIT 1", [org.id]);
    const agentId = agent ? agent.id : null;

    if (!agentId) {
        console.error("No agent found for contacts");
        return;
    }

    for (let i = 1; i <= 10; i++) {
        const id = sql.id();
        const firstName = `Client`;
        const lastName = `Test${i}`;
        const email = `client${i}@example.com`;

        // Mock some encrypted sensitive data
        const sensitiveInfo = encrypt(`SSN: 000-00-000${i}`);

        sql.run(`
            INSERT INTO Contact (id, firstName, lastName, email, phone, status, organizationId, encryptedData, userId, address, city, state, zip) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            id, firstName, lastName, email, `555-010${i}`, 'CUSTOMER', org.id, sensitiveInfo,
            agentId, // Use valid User ID
            '123 Test Lane', 'Madison', 'WI', '53703'
        ]);

        console.log(`Added Client: ${firstName} ${lastName}`);
    }

    console.log('Seeding complete.');
}

seedData();
