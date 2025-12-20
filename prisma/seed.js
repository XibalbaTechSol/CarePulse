import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import BetterSqlite3 from 'better-sqlite3';

const db = new BetterSqlite3('prisma/dev.db');
const adapter = new PrismaBetterSqlite3(db);
const prisma = new PrismaClient({ adapter });

async function main() {
    const org = await prisma.organization.upsert({
        where: { domain: 'nextiva-clone.io' },
        update: {},
        create: {
            name: 'Nextiva Clone Org',
            domain: 'nextiva-clone.io',
        }
    });

    const user = await prisma.user.upsert({
        where: { email: 'demo@example.com' },
        update: {
            organizationId: org.id,
            role: 'ADMIN',
        },
        create: {
            email: 'demo@example.com',
            name: 'Demo Admin',
            role: 'ADMIN',
            organizationId: org.id,
        },
    });

    const contacts = [
        { firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '555-0101', company: 'Tech Corp', status: 'CUSTOMER' },
        { firstName: 'Jane', lastName: 'Smith', email: 'jane@smith.io', phone: '555-0102', company: 'Innovation Inc', status: 'LEAD' },
    ];

    for (const c of contacts) {
        const contact = await prisma.contact.create({
            data: {
                ...c,
                userId: user.id,
                organizationId: org.id,
                deals: {
                    create: [
                        { title: `${c.company} Expansion`, value: Math.floor(Math.random() * 50000) + 5000, stage: 'QUALIFICATION' }
                    ]
                },
                tasks: {
                    create: [
                        { title: `Follow up with ${c.firstName}`, status: 'OPEN', priority: 'HIGH', userId: user.id }
                    ]
                }
            }
        });

        await prisma.activity.create({
            data: {
                type: 'NOTE',
                content: `Initial contact made with ${c.firstName} from ${c.company}`,
                userId: user.id,
                contactId: contact.id
            }
        });
    }

    console.log('Seed completed successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
