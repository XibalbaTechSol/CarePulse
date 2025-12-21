-- Enable foreign keys
PRAGMA foreign_keys = ON;

-- Organization
CREATE TABLE IF NOT EXISTS Organization (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    domain TEXT UNIQUE,
    npi TEXT,
    sandataConfigId TEXT, -- Will be handled by relation table or separate Query
    moduleConfigId TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User
CREATE TABLE IF NOT EXISTS User (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    organizationId TEXT,
    role TEXT DEFAULT 'USER', -- ADMIN, NURSE, CAREGIVER, OFFICE, USER
    nationalProviderId TEXT,
    providerSSN TEXT,
    certificationStatus TEXT DEFAULT 'UP_TO_DATE',
    hourlyRate REAL DEFAULT 20.00,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizationId) REFERENCES Organization(id) ON DELETE SET NULL
);

-- ModuleConfig
CREATE TABLE IF NOT EXISTS ModuleConfig (
    id TEXT PRIMARY KEY,
    organizationId TEXT UNIQUE NOT NULL,
    crmEnabled BOOLEAN DEFAULT 1,
    emailEnabled BOOLEAN DEFAULT 1,
    voipEnabled BOOLEAN DEFAULT 1,
    faxEnabled BOOLEAN DEFAULT 1,
    storageEnabled BOOLEAN DEFAULT 1,
    evvEnabled BOOLEAN DEFAULT 1,
    payrollEnabled BOOLEAN DEFAULT 1,
    auditEnabled BOOLEAN DEFAULT 1,
    formsEnabled BOOLEAN DEFAULT 1,
    dashboardLayout TEXT DEFAULT 'default',
    FOREIGN KEY (organizationId) REFERENCES Organization(id) ON DELETE CASCADE
);

-- EmailAccount
CREATE TABLE IF NOT EXISTS EmailAccount (
    id TEXT PRIMARY KEY,
    userId TEXT UNIQUE NOT NULL,
    imapHost TEXT NOT NULL,
    imapPort INTEGER NOT NULL,
    smtpHost TEXT NOT NULL,
    smtpPort INTEGER NOT NULL,
    username TEXT NOT NULL,
    password TEXT NOT NULL, -- Encrypted
    isActive BOOLEAN DEFAULT 1,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
);

-- SRFaxConfig
CREATE TABLE IF NOT EXISTS SRFaxConfig (
    id TEXT PRIMARY KEY,
    userId TEXT UNIQUE NOT NULL,
    accountId TEXT NOT NULL,
    password TEXT NOT NULL, -- Encrypted
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
);

-- SipAccount
CREATE TABLE IF NOT EXISTS SipAccount (
    id TEXT PRIMARY KEY,
    userId TEXT UNIQUE NOT NULL,
    username TEXT NOT NULL,
    password TEXT NOT NULL, -- Encrypted
    domain TEXT NOT NULL,
    websocketUrl TEXT NOT NULL,
    isActive BOOLEAN DEFAULT 1,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
);

-- Contact
CREATE TABLE IF NOT EXISTS Contact (
    id TEXT PRIMARY KEY,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    company TEXT,
    status TEXT DEFAULT 'LEAD', -- LEAD, CUSTOMER, PARTNER
    encryptedData TEXT,
    organizationId TEXT,
    userId TEXT NOT NULL,
    medicaidId TEXT,
    dateOfBirth DATETIME,
    admissionDate DATETIME,
    dischargeDate DATETIME,
    address TEXT,
    city TEXT,
    state TEXT,
    zip TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizationId) REFERENCES Organization(id) ON DELETE SET NULL,
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
);

-- Deal
CREATE TABLE IF NOT EXISTS Deal (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    value REAL NOT NULL,
    stage TEXT DEFAULT 'PROSPECTING',
    contactId TEXT NOT NULL,
    organizationId TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contactId) REFERENCES Contact(id) ON DELETE CASCADE,
    FOREIGN KEY (organizationId) REFERENCES Organization(id) ON DELETE SET NULL
);

-- Task
CREATE TABLE IF NOT EXISTS Task (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'OPEN',
    priority TEXT DEFAULT 'NORMAL',
    dueDate DATETIME,
    userId TEXT NOT NULL,
    contactId TEXT,
    dealId TEXT,
    organizationId TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (contactId) REFERENCES Contact(id) ON DELETE SET NULL,
    FOREIGN KEY (dealId) REFERENCES Deal(id) ON DELETE SET NULL,
    FOREIGN KEY (organizationId) REFERENCES Organization(id) ON DELETE SET NULL
);

-- Activity
CREATE TABLE IF NOT EXISTS Activity (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    content TEXT NOT NULL,
    userId TEXT NOT NULL,
    contactId TEXT,
    dealId TEXT,
    organizationId TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (contactId) REFERENCES Contact(id) ON DELETE SET NULL,
    FOREIGN KEY (dealId) REFERENCES Deal(id) ON DELETE SET NULL,
    FOREIGN KEY (organizationId) REFERENCES Organization(id) ON DELETE SET NULL
);

-- Message
CREATE TABLE IF NOT EXISTS Message (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    direction TEXT NOT NULL,
    status TEXT NOT NULL,
    content TEXT,
    duration INTEGER,
    fromField TEXT NOT NULL, -- 'from' is a reserved keyword in SQL often, using 'fromField' or quoting it. Let's use 'sender' or 'fromVal'. Sticking to schema, I'll allow 'from' but quoted if needed, or rename to 'senderAddr'. Mapped to 'from' in prisma.
    toField TEXT NOT NULL,   -- 'to' is reserved.
    userId TEXT NOT NULL,
    organizationId TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (organizationId) REFERENCES Organization(id) ON DELETE SET NULL
);

-- Fax
CREATE TABLE IF NOT EXISTS Fax (
    id TEXT PRIMARY KEY,
    direction TEXT NOT NULL,
    status TEXT NOT NULL,
    sender TEXT NOT NULL,
    recipient TEXT NOT NULL,
    fileUrl TEXT,
    remoteJobId TEXT,
    isRead BOOLEAN DEFAULT 0,
    userId TEXT NOT NULL,
    organizationId TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (organizationId) REFERENCES Organization(id) ON DELETE SET NULL
);

-- Document
CREATE TABLE IF NOT EXISTS Document (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    fileUrl TEXT,
    size INTEGER DEFAULT 0,
    type TEXT NOT NULL,
    isFolder BOOLEAN DEFAULT 0,
    isStarred BOOLEAN DEFAULT 0,
    parentId TEXT,
    userId TEXT NOT NULL,
    contactId TEXT,
    organizationId TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parentId) REFERENCES Document(id) ON DELETE SET NULL,
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (contactId) REFERENCES Contact(id) ON DELETE SET NULL,
    FOREIGN KEY (organizationId) REFERENCES Organization(id) ON DELETE SET NULL
);

-- SandataConfig
CREATE TABLE IF NOT EXISTS SandataConfig (
    id TEXT PRIMARY KEY,
    organizationId TEXT UNIQUE NOT NULL,
    agencyId TEXT NOT NULL,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    providerId TEXT,
    environment TEXT DEFAULT 'TEST',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizationId) REFERENCES Organization(id) ON DELETE CASCADE
);

-- Visit
CREATE TABLE IF NOT EXISTS Visit (
    id TEXT PRIMARY KEY,
    caregiverId TEXT NOT NULL,
    clientId TEXT NOT NULL,
    organizationId TEXT NOT NULL,
    serviceType TEXT NOT NULL,
    startDateTime DATETIME NOT NULL,
    endDateTime DATETIME,
    startLatitude REAL,
    startLongitude REAL,
    endLatitude REAL,
    endLongitude REAL,
    status TEXT DEFAULT 'IN_PROGRESS',
    sandataTransactionId TEXT,
    notes TEXT,
    clientSignature TEXT,
    claimId TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (caregiverId) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (clientId) REFERENCES Contact(id) ON DELETE CASCADE,
    FOREIGN KEY (organizationId) REFERENCES Organization(id) ON DELETE CASCADE
    -- claimId FK defined later or here if Claim exists. Circular dep potential.
);

-- Authorization
CREATE TABLE IF NOT EXISTS Authorization (
    id TEXT PRIMARY KEY,
    contactId TEXT NOT NULL,
    organizationId TEXT NOT NULL,
    authNumber TEXT NOT NULL,
    serviceCode TEXT NOT NULL,
    startDate DATETIME NOT NULL,
    endDate DATETIME NOT NULL,
    totalUnits REAL NOT NULL,
    usedUnits REAL DEFAULT 0,
    status TEXT DEFAULT 'ACTIVE',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contactId) REFERENCES Contact(id) ON DELETE CASCADE,
    FOREIGN KEY (organizationId) REFERENCES Organization(id) ON DELETE CASCADE
);

-- CarePlan
CREATE TABLE IF NOT EXISTS CarePlan (
    id TEXT PRIMARY KEY,
    contactId TEXT NOT NULL,
    organizationId TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'ACTIVE',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contactId) REFERENCES Contact(id) ON DELETE CASCADE,
    FOREIGN KEY (organizationId) REFERENCES Organization(id) ON DELETE CASCADE
);

-- CarePlanTask
CREATE TABLE IF NOT EXISTS CarePlanTask (
    id TEXT PRIMARY KEY,
    carePlanId TEXT NOT NULL,
    taskName TEXT NOT NULL,
    description TEXT,
    frequency TEXT,
    category TEXT,
    FOREIGN KEY (carePlanId) REFERENCES CarePlan(id) ON DELETE CASCADE
);

-- VisitTask
CREATE TABLE IF NOT EXISTS VisitTask (
    id TEXT PRIMARY KEY,
    visitId TEXT NOT NULL,
    taskId TEXT NOT NULL,
    completed BOOLEAN DEFAULT 0,
    comment TEXT,
    completedAt DATETIME,
    FOREIGN KEY (visitId) REFERENCES Visit(id) ON DELETE CASCADE,
    FOREIGN KEY (taskId) REFERENCES CarePlanTask(id) ON DELETE CASCADE
);

-- Certification
CREATE TABLE IF NOT EXISTS Certification (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    name TEXT NOT NULL,
    certNumber TEXT,
    issueDate DATETIME,
    expiryDate DATETIME,
    status TEXT DEFAULT 'ACTIVE',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
);

-- Assessment
CREATE TABLE IF NOT EXISTS Assessment (
    id TEXT PRIMARY KEY,
    contactId TEXT NOT NULL,
    nurseId TEXT NOT NULL,
    organizationId TEXT NOT NULL,
    type TEXT NOT NULL,
    data TEXT NOT NULL, -- JSON
    status TEXT DEFAULT 'DRAFT',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contactId) REFERENCES Contact(id) ON DELETE CASCADE,
    FOREIGN KEY (nurseId) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (organizationId) REFERENCES Organization(id) ON DELETE CASCADE
);

-- Form
CREATE TABLE IF NOT EXISTS Form (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    organizationId TEXT NOT NULL,
    isActive BOOLEAN DEFAULT 1,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizationId) REFERENCES Organization(id) ON DELETE CASCADE
);

-- FormField
CREATE TABLE IF NOT EXISTS FormField (
    id TEXT PRIMARY KEY,
    formId TEXT NOT NULL,
    label TEXT NOT NULL,
    type TEXT NOT NULL,
    required BOOLEAN DEFAULT 0,
    options TEXT,
    [order] INTEGER NOT NULL, -- 'order' is keyword
    FOREIGN KEY (formId) REFERENCES Form(id) ON DELETE CASCADE
);

-- FormSubmission
CREATE TABLE IF NOT EXISTS FormSubmission (
    id TEXT PRIMARY KEY,
    formId TEXT NOT NULL,
    data TEXT NOT NULL, -- JSON
    submittedById TEXT,
    organizationId TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (formId) REFERENCES Form(id) ON DELETE CASCADE
    -- submittedById FK optional
);

-- Invoice
CREATE TABLE IF NOT EXISTS Invoice (
    id TEXT PRIMARY KEY,
    invoiceNumber TEXT UNIQUE NOT NULL,
    organizationId TEXT NOT NULL,
    contactId TEXT NOT NULL,
    date DATETIME NOT NULL,
    dueDate DATETIME NOT NULL,
    status TEXT DEFAULT 'DRAFT',
    totalAmount REAL NOT NULL,
    paidAmount REAL DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizationId) REFERENCES Organization(id) ON DELETE CASCADE,
    FOREIGN KEY (contactId) REFERENCES Contact(id) ON DELETE CASCADE
);

-- InvoiceItem
CREATE TABLE IF NOT EXISTS InvoiceItem (
    id TEXT PRIMARY KEY,
    invoiceId TEXT NOT NULL,
    description TEXT NOT NULL,
    quantity REAL DEFAULT 1,
    unitPrice REAL NOT NULL,
    total REAL NOT NULL,
    visitId TEXT,
    FOREIGN KEY (invoiceId) REFERENCES Invoice(id) ON DELETE CASCADE,
    FOREIGN KEY (visitId) REFERENCES Visit(id) ON DELETE SET NULL
);

-- Claim
CREATE TABLE IF NOT EXISTS Claim (
    id TEXT PRIMARY KEY,
    claimId TEXT UNIQUE NOT NULL,
    organizationId TEXT NOT NULL,
    contactId TEXT NOT NULL,
    payerName TEXT NOT NULL,
    payerId TEXT,
    status TEXT DEFAULT 'DRAFT',
    totalBilled REAL NOT NULL,
    totalPaid REAL DEFAULT 0,
    serviceDateStart DATETIME NOT NULL,
    serviceDateEnd DATETIME NOT NULL,
    diagnosisCodes TEXT NOT NULL, -- JSON
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizationId) REFERENCES Organization(id) ON DELETE CASCADE,
    FOREIGN KEY (contactId) REFERENCES Contact(id) ON DELETE CASCADE
);

-- KnowledgeBase
CREATE TABLE IF NOT EXISTS KnowledgeBase (
    id TEXT PRIMARY KEY,
    organizationId TEXT NOT NULL,
    content TEXT NOT NULL,
    metadata TEXT,
    source TEXT,
    type TEXT DEFAULT 'REGULATION',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizationId) REFERENCES Organization(id) ON DELETE CASCADE
);

-- AuditLog
CREATE TABLE IF NOT EXISTS AuditLog (
    id TEXT PRIMARY KEY,
    userId TEXT,
    organizationId TEXT,
    action TEXT NOT NULL,
    entity TEXT,
    entityId TEXT,
    details TEXT,
    status TEXT DEFAULT 'SUCCESS',
    clientIp TEXT,
    userAgent TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Add ClaimId index/FK to Visit if needed, or handle in app logic
-- Ignoring circular FK for now, just relying on id matching.
