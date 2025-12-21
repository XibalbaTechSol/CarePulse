const puppeteer = require('puppeteer');

(async () => {
    // Launch browser (headless: "new" is the modern syntax, but true works)
            const browser = await puppeteer.launch({ 
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox'] 
            });
            const page = await browser.newPage();
            const baseURL = 'http://localhost:3000';
        
            try {        console.log('--- Verifying Forms Module ---');
        
        // 1. Navigate to Forms Dashboard
        console.log(`Navigating to ${baseURL}/dashboard/forms...`);
        await page.goto(`${baseURL}/dashboard/forms`, { waitUntil: 'networkidle0', timeout: 60000 });

        // 2. Verify Header
        await page.waitForSelector('h1.text-3xl', { timeout: 10000 });
        const title = await page.$eval('h1.text-3xl', el => el.innerText);
        console.log(`Page Title found: "${title}"`);
        if (!title.includes('Forms & Authorization Center')) {
            throw new Error('Page title mismatch');
        }

        // 3. Verify File Browser Elements
        console.log('Checking for File Browser elements...');
        await page.waitForSelector('button[title="Grid view"]');
        await page.waitForSelector('button[title="List view"]');
        console.log('View toggle buttons present.');

        // 4. Check for Templates
        console.log('Checking for PDF templates...');
        // In grid view, items have text-sm font-medium
        await page.waitForSelector('.group.relative', { timeout: 5000 });
        const templates = await page.$$eval('.group.relative span.truncate', els => els.map(e => e.innerText));
        console.log(`Found ${templates.length} templates:`, templates.join(', '));

        if (templates.length === 0) {
            console.warn('No templates found. Skipping editor verification.');
        } else {
            // 5. Open a Template
            console.log(`Opening template: ${templates[0]}...`);
            const firstTemplate = await page.$('.group.relative');
            await firstTemplate.click();

            // 6. Verify Editor Opened
            console.log('Waiting for PDF Editor to open...');
            // Check for specific editor buttons
            await page.waitForSelector('button[title="Download as PDF"]', { timeout: 10000 });
            console.log('Editor "Download" button found.');
            
            await page.waitForSelector('button[title="Try to autofill all fields"]');
            console.log('Editor "Autofill" button found.');

            // Verify Client Dropdown exists
            const clientSelect = await page.$('select');
            if (clientSelect) {
                console.log('Client selection dropdown found.');
            } else {
                throw new Error('Client dropdown missing');
            }

            // Close Editor
            console.log('Closing editor...');
            const closeBtn = await page.$('button > .lucide-x'); // Heuristic for X icon
            if (closeBtn) await closeBtn.click();
            else {
                // Try finding by generic close button selector if specific icon class structure varies
                 await page.click('button:has(svg.lucide-x)');
            }
        }

        console.log('\n--- Verification Successful! ---');

    } catch (error) {
        console.error('\n!!! Verification Failed !!!');
        console.error(error);
        process.exit(1);
    } finally {
        await browser.close();
    }
})();
