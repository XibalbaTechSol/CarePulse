import { sql } from '../db-sql';
import { v4 as uuidv4 } from 'uuid';

async function seedFaxes() {
    console.log('Starting fax seeding...');

    // 1. Get Organization and User
    // We'll try to get the 'Acme Corp' organization and a user from it.
    // If not found, we'll try to get ANY organization and user.
    let org = sql.get<any>("SELECT * FROM Organization WHERE domain = ?", ['acme.com']);
    if (!org) {
        console.log('Acme Corp not found, looking for any organization...');
        org = sql.get<any>("SELECT * FROM Organization LIMIT 1");
    }

    if (!org) {
        console.error('No organization found. Please run the main seed script first.');
        return;
    }

    let user = sql.get<any>("SELECT * FROM User WHERE organizationId = ? LIMIT 1", [org.id]);
    if (!user) {
        console.error(`No user found for organization ${org.name}.`);
        return;
    }

    console.log(`Using Organization: ${org.name} (${org.id})`);
    console.log(`Using User: ${user.email} (${user.id})`);

    const directions = ['SENT', 'RECEIVED'];
    const statuses = ['SUCCESS', 'FAILED', 'QUEUED', 'SENDING'];

    // Generate 50 mock faxes
    for (let i = 0; i < 50; i++) {
        const id = uuidv4();
        const direction = directions[Math.floor(Math.random() * directions.length)];

        // Weight success higher
        let status;
        const rand = Math.random();
        if (rand < 0.8) status = 'SUCCESS';
        else if (rand < 0.9) status = 'FAILED';
        else if (rand < 0.95) status = 'QUEUED';
        else status = 'SENDING';

        // Received faxes usually are success or failed, rarely queued/sending in history unless incoming
        if (direction === 'RECEIVED' && (status === 'QUEUED' || status === 'SENDING')) {
            status = 'SUCCESS';
        }

        const sender = direction === 'SENT' ? 'Me' : `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`;
        const recipient = direction === 'SENT' ? `+1${Math.floor(1000000000 + Math.random() * 9000000000)}` : 'Me';
        const fileUrl = `https://example.com/faxes/${id}.pdf`;
        const remoteJobId = uuidv4();

        // Random date within last 30 days
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));
        date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
        const createdAt = date.toISOString().replace('T', ' ').slice(0, 19);

        const isRead = direction === 'RECEIVED' ? (Math.random() > 0.5 ? 1 : 0) : 1;

        try {
            sql.run(`
                INSERT INTO Fax (
                    id, direction, status, sender, recipient, fileUrl, remoteJobId, 
                    isRead, userId, organizationId, createdAt
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                id, direction, status, sender, recipient, fileUrl, remoteJobId,
                isRead, user.id, org.id, createdAt
            ]);
            // console.log(`Created Fax ${i+1}: ${direction} ${status} on ${createdAt}`);
        } catch (e) {
            console.error(`Error creating fax ${i + 1}:`, e);
        }
    }

    console.log('Successfully seeded 50 mock faxes.');
}

seedFaxes();
