import { sql } from '../db-sql';
import fs from 'fs';
import path from 'path';

async function indexDocument(filePath: string, organizationId: string) {
    console.log(`Processing ${filePath}...`);
    const content = fs.readFileSync(filePath, 'utf-8');

    // Split content into chunks (simple paragraph splitting for now)
    const chunks = content.split('\n\n').filter(p => p.trim().length > 50);

    for (const chunk of chunks) {
        console.log(`Indexing chunk (${chunk.length} chars)...`);

        // In a real scenario, you'd use an embedding model here
        // const embedding = await generateEmbedding(chunk);

        const id = sql.id();
        const now = sql.now();

        sql.run(`
            INSERT INTO KnowledgeBase (id, organizationId, content, source, type, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, 'REGULATION', ?, ?)
        `, [id, organizationId, chunk, path.basename(filePath), now, now]);
    }

    console.log(`Completed indexing ${filePath}`);
}

// Example usage:
// indexDocument('./regulations/wisconsin_care_rules.txt', 'org_123');

async function main() {
    // This is a placeholder for automation
    console.log('Run this script with specific document paths to populate the KnowledgeBase.');
}

if (require.main === module) {
    main().catch(console.error);
}
