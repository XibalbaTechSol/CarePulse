const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');

async function createPARF() {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]);
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const form = pdfDoc.getForm();

    const drawLabel = (text, x, y) => {
        page.drawText(text, { x, y, size: 8, font, color: rgb(0, 0, 0) });
    };

    const createField = (name, x, y, w, h) => {
        const field = form.createTextField(name);
        field.addToPage(page, { x, y, width: w, height: h });
        field.setFontSize(10);
    };

    page.drawText('FORWARDHEALTH', { x: 50, y: height - 40, size: 14, font, color: rgb(0.5, 0, 0) });
    page.drawText('PRIOR AUTHORIZATION REQUEST FORM (PA/RF)', { x: 50, y: height - 60, size: 12, font });

    // Section 1: Provider Info
    drawLabel('1. Billing Provider Name', 50, height - 90);
    createField('billingProviderName', 50, height - 105, 250, 15);

    drawLabel('2. Billing Provider NPI', 320, height - 90);
    createField('billingProviderNPI', 320, height - 105, 150, 15);

    // Section 2: Member Info
    drawLabel('3. Member ID', 50, height - 130);
    createField('memberID', 50, height - 145, 150, 15);

    drawLabel('4. Member Name (Last, First, MI)', 220, height - 130);
    createField('memberName', 220, height - 145, 300, 15);

    // Section 3: Service Request (T1019)
    let y = height - 200;
    page.drawText('Service Request Details', { x: 50, y, size: 10, font });
    y -= 20;

    drawLabel('Service Code', 50, y);
    drawLabel('Modifier', 150, y);
    drawLabel('Start Date', 250, y);
    drawLabel('End Date', 350, y);
    drawLabel('Units', 450, y);

    y -= 15;
    createField('serviceCode_1', 50, y, 80, 15); // T1019
    createField('modifier_1', 150, y, 80, 15);
    createField('startDate_1', 250, y, 80, 15);
    createField('endDate_1', 350, y, 80, 15);
    createField('quantity_1', 450, y, 80, 15);

    // Diagnosis
    y -= 40;
    drawLabel('Primary Diagnosis Code (ICD-10)', 50, y);
    createField('primaryDiagnosis', 50, y - 15, 150, 15);

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync('public/templates/WI-F-62274A.pdf', pdfBytes);
    console.log('Generated WI-F-62274A.pdf');
}

createPARF();
