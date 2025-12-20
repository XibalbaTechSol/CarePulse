'use server';

import { PDFDocument, StandardFonts, PDFTextField } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/db';
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

    const contact = await prisma.contact.findUnique({
        where: { id: contactId },
        include: { carePlans: true, authorizations: true }
    });

    if (!contact) throw new Error('Contact not found');

    const organization = await prisma.organization.findUnique({
        where: { id: user.organizationId! }
    });

    const templatePath = path.join(process.cwd(), 'public/templates', templateName);
    const pdfBytes = fs.readFileSync(templatePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();

    // Data Context
    const data: any = {
        contact: {
            ...contact,
            name: `${contact.firstName} ${contact.lastName}`,
            complete_address: `${contact.address}, ${contact.city || ''} ${contact.state || ''} ${contact.zip || ''}`,
            dob: contact.dateOfBirth ? new Date(contact.dateOfBirth).toLocaleDateString() : '',
            city: contact.city || '',
            state: contact.state || '',
            zip: contact.zip || ''
        },
        organization: organization ? {
            ...organization,
            name: organization.name,
            npi: organization.npi || ''
        } : {}
    };

    // Mapping Logic
    try {
        const fields = form.getFields();
        const mapping = FORM_MAPPINGS['default']; // Use default for now, can be specific per templateName later

        fields.forEach(field => {
            if (field instanceof PDFTextField) {
                const name = field.getName().toLowerCase();
                let matched = false;

                // 1. Try exact/partial match from mapping
                for (const [key, path] of Object.entries(mapping)) {
                    if (name.includes(key)) {
                        try {
                            const [obj, prop] = path.split('.');
                            const val = data[obj]?.[prop];
                            if (val) {
                                field.setText(val);
                                matched = true;
                            }
                        } catch (err) { /* ignore */ }
                    }
                }

                // 2. Fallback Generic Heuristics if no verified match
                if (!matched) {
                    if (name.includes('date') && !name.includes('birth')) {
                        try { field.setText(new Date().toLocaleDateString()); } catch { /* ignore */ }
                    }
                }
            }
        });
    } catch (e) {
        console.log('Error filling fields (might be flat PDF):', e);
    }

    // Special handling for CMS 485 if it's flat (Overlay text) - Keeping existing logic
    if (templateName.includes('485') && form.getFields().length === 0) {
        const pages = pdfDoc.getPages();
        const page = pages[0];
        const { height } = page.getSize();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // Heuristic coordinates for standard 485
        // Patient Name Top Left
        page.drawText(data.contact.name, { x: 50, y: height - 120, size: 10, font });
        // HICN / Medicaid ID
        page.drawText(data.contact.medicaidId || '', { x: 300, y: height - 120, size: 10, font });
        // Address
        page.drawText(data.contact.complete_address, { x: 50, y: height - 140, size: 10, font });
        // Date of Birth
        page.drawText(data.contact.dob, { x: 400, y: height - 140, size: 10, font });
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
    await prisma.document.create({
        data: {
            name: fileName,
            fileUrl: `/uploads/${fileName}`,
            type: 'application/pdf',
            size: filledPdfBytes.length,
            userId: user.id,
            organizationId: user.organizationId,
            contactId: contact.id
        }
    });

    return { success: true, filePath: `/uploads/${fileName}` };
}
