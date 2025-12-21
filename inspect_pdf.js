const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

async function inspectPDF(path) {
    console.log(`Inspecting ${path}...`);
    try {
        const pdfBytes = fs.readFileSync(path);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const form = pdfDoc.getForm();
        const fields = form.getFields();
        fields.forEach(field => {
            const type = field.constructor.name;
            const name = field.getName();
            console.log(`${name} (${type})`);
        });
    } catch (e) {
        console.error(`Error inspecting ${path}:`, e.message);
    }
    console.log('---');
}

(async () => {
    const files = process.argv.slice(2);
    if (files.length === 0) {
        console.log('Usage: node inspect_pdf.js <file1> <file2> ...');
    } else {
        for (const file of files) {
            await inspectPDF(file);
        }
    }
})();
