import { prisma } from './db';

/**
 * Mock Authentication Helper
 * In a real SaaS, this would use NextAuth or similar.
 */
export async function getCurrentUser() {
    // Always return the demo user for now
    let user = await prisma.user.findUnique({
        where: { email: 'demo@example.com' },
        include: { organization: true }
    });

    if (!user || !user.organizationId) {
        // Create Org if needed
        let org = user?.organizationId ? await prisma.organization.findUnique({ where: { id: user.organizationId } }) : null;

        if (!org) {
            org = await prisma.organization.create({
                data: {
                    name: 'Acme Corp',
                    domain: 'acme.com',
                }
            });
        }

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: 'demo@example.com',
                    name: 'Demo Admin',
                    role: 'ADMIN',
                    organizationId: org.id
                },
                include: { organization: true }
            });
        } else {
            // Update existing user to include org and admin role
            user = await prisma.user.update({
                where: { id: user.id },
                data: {
                    organizationId: org.id,
                    role: 'ADMIN' // Promoting existing demo user to admin
                },
                include: { organization: true }
            });
        }
    }

    // Ensure strictly typed return or at least consistent
    return user;
}
