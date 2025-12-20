const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');

async function createDummyWIForm() {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    page.drawText('Wisconsin Personal Care Agency', {
        x: 50,
        y: height - 50,
        size: 20,
        font: font,
        color: rgb(0, 0, 0),
    });

    page.drawText('Client Consent for Home Visit (F-62274A)', {
        x: 50,
        y: height - 80,
        size: 16,
        font: font,
    });

    const form = pdfDoc.getForm();

    page.drawText('Client Name:', { x: 50, y: height - 150, size: 12, font: font });
    const nameField = form.createTextField('clientName');
    nameField.setText('');
    nameField.addToPage(page, { x: 150, y: height - 165, width: 200, height: 20 });

    page.drawText('Date:', { x: 50, y: height - 200, size: 12, font: font });
    const dateField = form.createTextField('date');
    dateField.setText('');
    dateField.addToPage(page, { x: 150, y: height - 215, width: 200, height: 20 });

    page.drawText('Address:', { x: 50, y: height - 250, size: 12, font: font });
    const addrField = form.createTextField('address');
    addrField.setText('');
    addrField.addToPage(page, { x: 150, y: height - 265, width: 300, height: 20 });

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync('public/templates/WI-F-62274A.pdf', pdfBytes);
}

createDummyWIForm();
