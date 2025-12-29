import { db } from '../db-sql';

const sql = `
-- Tag
CREATE TABLE IF NOT EXISTS Tag (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#3b82f6',
    organizationId TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizationId) REFERENCES Organization(id) ON DELETE CASCADE,
    UNIQUE(organizationId, name)
);

-- ContactTag
CREATE TABLE IF NOT EXISTS ContactTag (
    contactId TEXT NOT NULL,
    tagId TEXT NOT NULL,
    assignedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (contactId, tagId),
    FOREIGN KEY (contactId) REFERENCES Contact(id) ON DELETE CASCADE,
    FOREIGN KEY (tagId) REFERENCES Tag(id) ON DELETE CASCADE
);

-- UserTag
CREATE TABLE IF NOT EXISTS UserTag (
    userId TEXT NOT NULL,
    tagId TEXT NOT NULL,
    assignedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (userId, tagId),
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (tagId) REFERENCES Tag(id) ON DELETE CASCADE
);
`;

try {
    console.log('Migrating Tags...');
    db.exec(sql);
    console.log('Tags migration completed successfully.');
} catch (error) {
    console.error('Migration failed:', error);
}
