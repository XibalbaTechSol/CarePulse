const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');

async function createCMS485() {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]); // Standard Letter
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

    page.drawText('CMS-485: Home Health Certification and Plan of Care', { x: 50, y: height - 40, size: 14, font });

    // Box 1: Patient HI Claim No.
    drawLabel('1. Patient HI Claim No.', 50, height - 70);
    createField('claimNumber', 50, height - 85, 150, 15);

    // Box 2: Start of Care Date
    drawLabel('2. Start of Care Date', 220, height - 70);
    createField('socDate', 220, height - 85, 100, 15);

    // Box 3: Cert Period
    drawLabel('3. Certification Period From/To', 340, height - 70);
    createField('certPeriod', 340, height - 85, 200, 15);

    // Box 4: Medical Record No
    drawLabel('4. Medical Record No.', 50, height - 110);
    createField('mrn', 50, height - 125, 150, 15);

    // Box 5: Patient Name
    drawLabel('5. Patient Name (Last, First, MI)', 220, height - 110);
    createField('patientName', 220, height - 125, 320, 15);

    // Box 6: Patient Address
    drawLabel('6. Patient Address', 50, height - 150);
    createField('patientAddress', 50, height - 165, 500, 15);

    // Box 7: Provider Name
    drawLabel('7. Provider Name/Address', 50, height - 190);
    createField('providerInfo', 50, height - 205, 500, 15);

    // Box 11: ICD-10
    drawLabel('11. ICD-10 Principal Diagnosis', 50, height - 230);
    createField('icdCodes', 50, height - 245, 500, 15);

    // Box 10: Medications
    drawLabel('10. Medications', 50, height - 270);
    createField('medications', 50, height - 285, 500, 30);

    // Box 21: Orders
    drawLabel('21. Orders for Discipline and Treatments', 50, height - 330);
    createField('orders', 50, height - 430, 500, 100); // Large box

    // Box 22: Goals
    drawLabel('22. Goals/Rehabilitation Potential', 50, height - 460);
    createField('goals', 50, height - 510, 500, 50);

    // Box 23: Nurse Signature
    drawLabel('23. Nurse Signature', 50, height - 540);
    createField('nurseSignature', 50, height - 555, 200, 15);

    // Box 24: Date Signed
    drawLabel('24. Date Signed', 270, height - 540);
    createField('dateSigned', 270, height - 555, 100, 15);

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync('public/templates/CMS-485-P.pdf', pdfBytes);
    console.log('Generated CMS-485-P.pdf');
}

createCMS485();
