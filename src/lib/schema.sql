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

-- AIAnalysis
-- Stores AI model outputs and analysis results
CREATE TABLE IF NOT EXISTS AIAnalysis (
    id TEXT PRIMARY KEY,
    modelName TEXT NOT NULL,  -- 'phi3:mini', 'ClinicalBERT', 'CheXNet', etc.
    modelVersion TEXT,
    inputType TEXT NOT NULL,  -- 'TEXT', 'IMAGE', 'STRUCTURED_DATA'
    inputId TEXT,  -- References Assessment.id, Document.id, Claim.id, etc.
    outputData TEXT NOT NULL,  -- JSON string of AI results
    confidenceScore REAL,  -- 0.0 to 1.0
    reviewStatus TEXT DEFAULT 'PENDING',  -- 'PENDING', 'APPROVED', 'REJECTED'
    reviewedBy TEXT,  -- User.id who validated the AI output
    organizationId TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reviewedBy) REFERENCES User(id),
    FOREIGN KEY (organizationId) REFERENCES Organization(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_ai_analysis_input ON AIAnalysis(inputType, inputId);
CREATE INDEX IF NOT EXISTS idx_ai_analysis_review ON AIAnalysis(reviewStatus, organizationId);

-- EmbeddingCache
-- Stores vector embeddings for RAG (Knowledge Base, clinical notes, etc.)
CREATE TABLE IF NOT EXISTS EmbeddingCache (
    id TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    contentHash TEXT UNIQUE NOT NULL,  -- SHA-256 of content for dedup
    embeddingModel TEXT NOT NULL,  -- 'all-MiniLM-L6-v2', etc.
    embedding BLOB NOT NULL,  -- Vector embedding stored as binary
    sourceType TEXT,  -- 'KnowledgeBase', 'Assessment', 'Document'
    sourceId TEXT,  -- Reference to original record
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_embedding_hash ON EmbeddingCache(contentHash);
CREATE INDEX IF NOT EXISTS idx_embedding_source ON EmbeddingCache(sourceType, sourceId);

-- Add ClaimId index/FK to Visit if needed, or handle in app logic
-- Ignoring circular FK for now, just relying on id matching.

-- Phase 2: High-Impact Clinical Modules Extensions

CREATE TABLE IF NOT EXISTS EmergencyVisit (
    id TEXT PRIMARY KEY,
    patientId TEXT NOT NULL,
    chiefComplaint TEXT NOT NULL,
    arrivalTime DATETIME NOT NULL,
    status TEXT DEFAULT 'WAITING',
    esiScore INTEGER,
    predictedWaitTime INTEGER,
    organizationId TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patientId) REFERENCES Contact(id) ON DELETE CASCADE,
    FOREIGN KEY (organizationId) REFERENCES Organization(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS ClinicalNote (
    id TEXT PRIMARY KEY,
    patientId TEXT NOT NULL,
    providerId TEXT NOT NULL,
    encounterId TEXT,
    visitId TEXT,
    type TEXT NOT NULL, -- SOAP, ADMISSION, PROGRESS, DISCHARGE
    content TEXT NOT NULL, -- JSON structure with soap fields
    summary TEXT,
    status TEXT DEFAULT 'DRAFT', -- DRAFT, SIGNED, AMENDED
    signedAt DATETIME,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patientId) REFERENCES Contact(id) ON DELETE CASCADE,
    FOREIGN KEY (providerId) REFERENCES User(id),
    FOREIGN KEY (visitId) REFERENCES Visit(id)
);

CREATE TABLE IF NOT EXISTS Diagnosis (
    id TEXT PRIMARY KEY,
    patientId TEXT NOT NULL,
    code TEXT NOT NULL, -- ICD-10
    description TEXT NOT NULL,
    type TEXT DEFAULT 'ADMISSION', -- ADMISSION, DISCHARGE, CHRONIC
    status TEXT DEFAULT 'ACTIVE', -- ACTIVE, RESOLVED
    diagnosedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patientId) REFERENCES Contact(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Medication (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT, -- RxNorm
    description TEXT,
    strength TEXT,
    form TEXT,
    manufacturer TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Prescription (
    id TEXT PRIMARY KEY,
    patientId TEXT NOT NULL,
    providerId TEXT NOT NULL,
    medicationId TEXT, 
    medicationName TEXT, -- Fallback if not linked
    dosage TEXT NOT NULL,
    frequency TEXT NOT NULL,
    route TEXT,
    quantity REAL,
    refills INTEGER DEFAULT 0,
    startDate DATETIME,
    endDate DATETIME,
    status TEXT DEFAULT 'ACTIVE', -- ACTIVE, DISCONTINUED, EXPIRED
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patientId) REFERENCES Contact(id) ON DELETE CASCADE,
    FOREIGN KEY (providerId) REFERENCES User(id),
    FOREIGN KEY (medicationId) REFERENCES Medication(id)
);

CREATE TABLE IF NOT EXISTS VitalSign (
    id TEXT PRIMARY KEY,
    patientId TEXT NOT NULL,
    recordedBy TEXT,
    visitId TEXT,
    type TEXT NOT NULL, -- BP_SYSTOLIC, BP_DIASTOLIC, HR, RR, SPO2, TEMP, WEIGHT, GLUCOSE
    value REAL NOT NULL,
    unit TEXT NOT NULL,
    recordedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patientId) REFERENCES Contact(id) ON DELETE CASCADE,
    FOREIGN KEY (visitId) REFERENCES Visit(id),
    FOREIGN KEY (recordedBy) REFERENCES User(id)
);

CREATE TABLE IF NOT EXISTS ClinicalAlert (
    id TEXT PRIMARY KEY,
    patientId TEXT NOT NULL,
    type TEXT NOT NULL, -- SEPSIS_RISK, DETERIORATION, LAB_CRITICAL, FALL_RISK
    severity TEXT NOT NULL, -- LOW, MEDIUM, HIGH, CRITICAL
    score REAL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'OPEN', -- OPEN, ACKNOWLEDGED, RESOLVED, FALSE_POSITIVE
    triggeredAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    resolvedAt DATETIME,
    resolvedBy TEXT,
    FOREIGN KEY (patientId) REFERENCES Contact(id) ON DELETE CASCADE,
    FOREIGN KEY (resolvedBy) REFERENCES User(id)
);

-- Phase 3: Hospital Operations Extensions

CREATE TABLE IF NOT EXISTS OperatingRoom (
    id TEXT PRIMARY KEY,
    organizationId TEXT NOT NULL,
    name TEXT NOT NULL,
    type TEXT, -- GENERAL, ORTHO, CARDIAC
    status TEXT DEFAULT 'AVAILABLE', -- AVAILABLE, IN_USE, CLEANING, MAINTENANCE
    currentCaseId TEXT,
    FOREIGN KEY (organizationId) REFERENCES Organization(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS SurgicalCase (
    id TEXT PRIMARY KEY,
    patientId TEXT NOT NULL,
    surgeonId TEXT NOT NULL,
    operatingRoomId TEXT,
    procedureName TEXT NOT NULL,
    procedureCode TEXT, -- CPT
    scheduledStartTime DATETIME,
    estimatedDuration INTEGER, -- minutes
    actualStartTime DATETIME,
    actualEndTime DATETIME,
    status TEXT DEFAULT 'SCHEDULED',
    FOREIGN KEY (patientId) REFERENCES Contact(id),
    FOREIGN KEY (surgeonId) REFERENCES User(id),
    FOREIGN KEY (operatingRoomId) REFERENCES OperatingRoom(id)
);

CREATE TABLE IF NOT EXISTS HospitalBed (
    id TEXT PRIMARY KEY,
    organizationId TEXT NOT NULL,
    roomNumber TEXT NOT NULL,
    bedNumber TEXT NOT NULL,
    ward TEXT,
    department TEXT, -- ICU, MEDSURG, ER
    status TEXT DEFAULT 'AVAILABLE', -- AVAILABLE, OCCUPIED, CLEANING
    currentPatientId TEXT,
    FOREIGN KEY (organizationId) REFERENCES Organization(id) ON DELETE CASCADE,
    FOREIGN KEY (currentPatientId) REFERENCES Contact(id)
);

CREATE TABLE IF NOT EXISTS LabOrder (
    id TEXT PRIMARY KEY,
    patientId TEXT NOT NULL,
    orderingProviderId TEXT NOT NULL,
    testCode TEXT, -- LOINC
    testName TEXT NOT NULL,
    priority TEXT DEFAULT 'ROUTINE',
    status TEXT DEFAULT 'ORDERED', -- ORDERED, COLLECTED, RECEIVED, COMPLETED
    orderedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    completedAt DATETIME,
    FOREIGN KEY (patientId) REFERENCES Contact(id) ON DELETE CASCADE,
    FOREIGN KEY (orderingProviderId) REFERENCES User(id)
);

CREATE TABLE IF NOT EXISTS LabResult (
    id TEXT PRIMARY KEY,
    orderId TEXT NOT NULL,
    componentName TEXT NOT NULL,
    value TEXT NOT NULL,
    unit TEXT,
    referenceRange TEXT,
    isAbnormal BOOLEAN DEFAULT 0,
    isCritical BOOLEAN DEFAULT 0,
    FOREIGN KEY (orderId) REFERENCES LabOrder(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS RadiographicStudy (
    id TEXT PRIMARY KEY,
    patientId TEXT NOT NULL,
    orderingProviderId TEXT,
    modality TEXT NOT NULL, -- XRAY, CT, MRI, US
    bodyPart TEXT,
    status TEXT DEFAULT 'ORDERED',
    studyDate DATETIME,
    imageUrl TEXT, -- Link to PACS/storage
    reportText TEXT,
    findings TEXT, -- Struct or JSON
    FOREIGN KEY (patientId) REFERENCES Contact(id) ON DELETE CASCADE,
    FOREIGN KEY (orderingProviderId) REFERENCES User(id)
);

-- Phase 4: Administrative Extensions (Claim already exists)

CREATE TABLE IF NOT EXISTS Referral (
    id TEXT PRIMARY KEY,
    patientId TEXT NOT NULL,
    fromProviderId TEXT,
    toProviderId TEXT,
    specialty TEXT,
    reason TEXT,
    priority TEXT DEFAULT 'ROUTINE',
    status TEXT DEFAULT 'PENDING',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patientId) REFERENCES Contact(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS InventoryItem (
    id TEXT PRIMARY KEY,
    organizationId TEXT NOT NULL,
    name TEXT NOT NULL,
    sku TEXT,
    category TEXT,
    quantityOnHand INTEGER DEFAULT 0,
    parLevel INTEGER,
    unitCost REAL,
    FOREIGN KEY (organizationId) REFERENCES Organization(id) ON DELETE CASCADE
);

-- Phase 5: Specialty Extensions

CREATE TABLE IF NOT EXISTS OncologyRegimen (
    id TEXT PRIMARY KEY,
    patientId TEXT NOT NULL,
    name TEXT NOT NULL,
    cancerType TEXT,
    stage TEXT,
    startDate DATETIME,
    status TEXT DEFAULT 'ACTIVE',
    FOREIGN KEY (patientId) REFERENCES Contact(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS PrenatalRecord (
    id TEXT PRIMARY KEY,
    patientId TEXT NOT NULL,
    edd DATETIME, -- Estimated Due Date
    gravida INTEGER,
    para INTEGER,
    bloodType TEXT,
    riskAssessment TEXT,
    FOREIGN KEY (patientId) REFERENCES Contact(id) ON DELETE CASCADE
);

-- Phase 6 & 7: Patient & Research

CREATE TABLE IF NOT EXISTS TelehealthSession (
    id TEXT PRIMARY KEY,
    patientId TEXT NOT NULL,
    providerId TEXT NOT NULL,
    scheduledTime DATETIME,
    duration INTEGER,
    status TEXT DEFAULT 'SCHEDULED',
    meetingUrl TEXT,
    FOREIGN KEY (patientId) REFERENCES Contact(id) ON DELETE CASCADE,
    FOREIGN KEY (providerId) REFERENCES User(id)
);

CREATE TABLE IF NOT EXISTS DeviceReading (
    id TEXT PRIMARY KEY,
    patientId TEXT NOT NULL,
    deviceType TEXT NOT NULL,
    deviceId TEXT,
    readingType TEXT NOT NULL,
    value REAL NOT NULL,
    unit TEXT,
    recordedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patientId) REFERENCES Contact(id) ON DELETE CASCADE
);

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
