import { sql, db } from './db-sql';

async function testDb() {
    console.log('Testing DB Access...');

    // 1. Check if tables exist
    const tables = sql.all("SELECT name FROM sqlite_master WHERE type='table'");
    console.log('Tables found:', tables.map((t: any) => t.name).join(', '));

    if (tables.length === 0) {
        console.error('No tables found! Schema init failed?');
        return;
    }

    // 2. Try simple insert/select
    try {
        const testOrgId = sql.id();
        sql.run("INSERT INTO Organization (id, name, domain) VALUES (?, ?, ?)", [testOrgId, 'Test Org', 'test.com']);
        console.log('Inserted Organization');

        const org = sql.get("SELECT * FROM Organization WHERE id = ?", [testOrgId]);
        console.log('Retrieved Org:', org);

        // Clean up
        sql.run("DELETE FROM Organization WHERE id = ?", [testOrgId]);
        console.log('Cleaned up test data');
    } catch (e) {
        console.error('SQL Test Failed:', e);
    }
}

testDb();
