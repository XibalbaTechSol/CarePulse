import { sql } from './db-sql';

/**
 * Mock Authentication Helper
 * In a real SaaS, this would use NextAuth or similar.
 */
export async function getCurrentUser() {
    // Always return the demo user for now
    // Join with Organization to match Prisma 'include: { organization: true }'
    const query = `
        SELECT u.*, 
               o.id as org_id, o.name as org_name, o.domain as org_domain, o.npi as org_npi
        FROM User u
        LEFT JOIN Organization o ON u.organizationId = o.id
        WHERE u.email = ?
    `;

    let userResult = sql.get<any>(query, ['demo@example.com']);

    if (!userResult || !userResult.organizationId) {
        console.log('User or Org missing, creating mock data...');

        let orgId = userResult?.organizationId;
        if (!orgId) {
            // Check if default org exists
            const existingOrg = sql.get<any>("SELECT * FROM Organization WHERE domain = ?", ['acme.com']);
            if (existingOrg) {
                orgId = existingOrg.id;
            } else {
                orgId = sql.id();
                sql.run("INSERT INTO Organization (id, name, domain) VALUES (?, ?, ?)", [orgId, 'Acme Corp', 'acme.com']);
            }
        }

        if (!userResult) {
            const userId = sql.id();
            sql.run(`
                INSERT INTO User (id, email, name, role, organizationId) 
                VALUES (?, ?, ?, ?, ?)
            `, [userId, 'demo@example.com', 'Demo Admin', 'ADMIN', orgId]);
            userResult = sql.get(query, ['demo@example.com']);
        } else {
            // Update existing user
            sql.run("UPDATE User SET organizationId = ?, role = 'ADMIN' WHERE id = ?", [orgId, userResult.id]);
            userResult = sql.get(query, ['demo@example.com']);
        }
    }

    // Map flat SQL result to nested object to match Prisma
    if (userResult) {
        const { org_id, org_name, org_domain, org_npi, ...userFields } = userResult;
        return {
            ...userFields,
            organization: org_id ? {
                id: org_id,
                name: org_name,
                domain: org_domain,
                npi: org_npi
            } : null
        };
    }

    return null;
}
