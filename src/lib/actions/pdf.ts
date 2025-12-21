'use server';

import { PDFDocument, StandardFonts, PDFTextField } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { sql } from '@/lib/db-sql';
import { getCurrentUser } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function getPDFTemplates() {
    const templatesDir = path.join(process.cwd(), 'public/templates');
    if (!fs.existsSync(templatesDir)) {
        return [];
    }
    const files = fs.readdirSync(templatesDir).filter(file => file.endsWith('.pdf'));
    return files;
}

import { FORM_MAPPINGS } from '@/lib/forms/wi_personal_care';

export async function fillPDFTemplate(templateName: string, contactId: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const contact = sql.get<any>(`SELECT * FROM Contact WHERE id = ?`, [contactId]);

    if (!contact) throw new Error('Contact not found');

    // Hydrate
    contact.carePlans = sql.all(`SELECT * FROM CarePlan WHERE contactId = ?`, [contactId]);
    contact.authorizations = sql.all(`SELECT * FROM Authorization WHERE contactId = ?`, [contactId]);

    const organization = sql.get<any>(`SELECT * FROM Organization WHERE id = ?`, [user.organizationId]);

    const templatePath = path.join(process.cwd(), 'public/templates', templateName);
    const pdfBytes = fs.readFileSync(templatePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();

    // Prepare Data Context
    const activeCarePlan = contact.carePlans?.[0]; // Simplification
    const activeAuth = contact.authorizations?.[0];

    const data: any = {
        contact: {
            ...contact,
            name: `${contact.firstName} ${contact.lastName}`,
            complete_address: `${contact.address || ''}, ${contact.city || ''} ${contact.state || ''} ${contact.zip || ''}`.replace(/^, /, ''),
            dob: contact.dateOfBirth ? new Date(contact.dateOfBirth).toLocaleDateString() : '',
            admissionDate: contact.admissionDate ? new Date(contact.admissionDate).toLocaleDateString() : new Date().toLocaleDateString(),
        },
        organization: organization ? {
            ...organization,
            name: organization.name,
            npi: organization.npi || ''
        } : {},
        carePlan: {
            goals: activeCarePlan?.description || 'Maintain safety and independence in home environment.',
            tasks: activeCarePlan ? sql.all<any>(`SELECT taskName FROM CarePlanTask WHERE carePlanId = ?`, [activeCarePlan.id]).map(t => t.taskName).join(', ') : 'ADL Assistance'
        },
        auth: {
            serviceCode: activeAuth?.serviceCode || 'T1019',
            modifier: 'U1', // Standard WI Level
            units: activeAuth?.totalUnits || '100',
            startDate: activeAuth ? new Date(activeAuth.startDate).toLocaleDateString() : new Date().toLocaleDateString(),
            endDate: activeAuth ? new Date(activeAuth.endDate).toLocaleDateString() : new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString()
        },
        clinical: {
            diagnosis: 'R54 (Age-related physical debility)' // Placeholder if no dedicated clinical table yet
        }
    };

    // Mapping Logic
    try {
        const fields = form.getFields();
        // Determine mapping key: Remove extension, match against keys
        const templateKey = templateName.replace('.pdf', '');
        const mapping = FORM_MAPPINGS[templateKey] || FORM_MAPPINGS['default'];

        fields.forEach(field => {
            if (field instanceof PDFTextField) {
                const name = field.getName();
                let val = '';

                // 1. Explicit Mapping
                if (mapping[name]) {
                    const path = mapping[name];
                    try {
                        const [obj, prop] = path.split('.');
                        val = data[obj]?.[prop];
                    } catch (err) { console.warn(`Mapping error for ${name}:`, err); }
                } 
                // 2. Fuzzy / Fallback Mapping (if not explicit)
                else {
                    const lowerName = name.toLowerCase();
                    // Check default dictionary for common terms
                    for (const [key, path] of Object.entries(FORM_MAPPINGS['default'])) {
                        if (lowerName.includes(key)) {
                            const [obj, prop] = path.split('.');
                            val = data[obj]?.[prop];
                            break;
                        }
                    }
                }

                if (val) {
                    field.setText(String(val));
                }
            }
        });
    } catch (e) {
        console.log('Error filling fields:', e);
    }

    // Save
    const filledPdfBytes = await pdfDoc.save();
    const fileName = `filled_${templateName.replace('.pdf', '')}_${contact.lastName}_${uuidv4().substring(0, 8)}.pdf`;

    // Ensure uploads dir
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, filledPdfBytes);

    // Create Document record
    const id = sql.id();
    const now = sql.now();
    sql.run(`
        INSERT INTO Document (id, name, fileUrl, type, size, userId, organizationId, contactId, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, fileName, `/uploads/${fileName}`, 'application/pdf', filledPdfBytes.length, user.id, user.organizationId, contact.id, now, now]);

    return { success: true, filePath: `/uploads/${fileName}` };
}

export async function getContactFormData(contactId: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const contact = sql.get<any>(`SELECT * FROM Contact WHERE id = ?`, [contactId]);
    if (!contact) throw new Error('Contact not found');

    // Hydrate
    contact.carePlans = sql.all(`SELECT * FROM CarePlan WHERE contactId = ?`, [contactId]);
    contact.authorizations = sql.all(`SELECT * FROM Authorization WHERE contactId = ?`, [contactId]);

    const organization = sql.get<any>(`SELECT * FROM Organization WHERE id = ?`, [user.organizationId]);

    const activeCarePlan = contact.carePlans?.[0];
    const activeAuth = contact.authorizations?.[0];

    // Return the standard data object used for mapping
    return {
        contact: {
            ...contact,
            name: `${contact.firstName} ${contact.lastName}`,
            complete_address: `${contact.address || ''}, ${contact.city || ''} ${contact.state || ''} ${contact.zip || ''}`.replace(/^, /, ''),
            dob: contact.dateOfBirth ? new Date(contact.dateOfBirth).toLocaleDateString() : '',
            admissionDate: contact.admissionDate ? new Date(contact.admissionDate).toLocaleDateString() : new Date().toLocaleDateString(),
        },
        organization: organization ? {
            ...organization,
            name: organization.name,
            npi: organization.npi || ''
        } : {},
        carePlan: {
            goals: activeCarePlan?.description || 'Maintain safety and independence in home environment.',
            tasks: activeCarePlan ? sql.all<any>(`SELECT taskName FROM CarePlanTask WHERE carePlanId = ?`, [activeCarePlan.id]).map(t => t.taskName).join(', ') : 'ADL Assistance'
        },
        auth: {
            serviceCode: activeAuth?.serviceCode || 'T1019',
            modifier: 'U1',
            units: activeAuth?.totalUnits || '100',
            startDate: activeAuth ? new Date(activeAuth.startDate).toLocaleDateString() : new Date().toLocaleDateString(),
            endDate: activeAuth ? new Date(activeAuth.endDate).toLocaleDateString() : new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString()
        },
        clinical: {
            diagnosis: 'R54 (Age-related physical debility)'
        }
    };
}

export async function uploadFilledPDF(formData: FormData) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const file = formData.get('file') as File;
    const contactId = formData.get('contactId') as string;
    
    if (!file) throw new Error('No file provided');

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name;
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);

    const id = sql.id();
    const now = sql.now();

    sql.run(`
        INSERT INTO Document (id, name, fileUrl, type, size, userId, organizationId, contactId, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, fileName, `/uploads/${fileName}`, 'application/pdf', buffer.length, user.id, user.organizationId, contactId || null, now, now]);

    return { success: true, filePath: `/uploads/${fileName}`, documentId: id };
}
