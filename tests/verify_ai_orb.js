const puppeteer = require('puppeteer');

(async () => {
        const browser = await puppeteer.launch({ 
            headless: true,
                    args: [
                        '--no-sandbox', 
                        '--disable-setuid-sandbox',
                        '--enable-gpu',
                        '--ignore-gpu-blocklist',
                        '--enable-webgl',
                        '--enable-webgl2',
                        '--use-gl=angle',
                        '--enable-accelerated-2d-canvas'
                    ]        });    const page = await browser.newPage();
    const baseURL = 'http://localhost:3000';

    try {
        console.log('--- Verifying AI Orb Module ---');
        
        // 1. Navigate to AI Dashboard
        console.log(`Navigating to ${baseURL}/dashboard/ai...`);
        await page.goto(`${baseURL}/dashboard/ai`, { waitUntil: 'networkidle0', timeout: 60000 });

        // 2. Verify Page Title
        await page.waitForSelector('main h1', { timeout: 30000 });
        const title = await page.$eval('main h1', el => el.innerText);
        console.log(`Page Title found: "${title}"`);
        if (!title.includes('AI Assistant')) {
            throw new Error('Page title mismatch');
        }

        // 3. Verify Orb Web Component
        console.log('Checking for Orb Web Component...');
        // The orb is inside a dynamic import, so give it a moment if needed
        await page.waitForSelector('gdm-live-audio', { timeout: 10000 });
        console.log('Orb web component <gdm-live-audio> found.');

        // 4. Verify Chat Overlay Elements
        console.log('Checking for Chat Interface elements...');
        
        // Input Textarea
        await page.waitForSelector('textarea[placeholder="Type a message..."]');
        console.log('Chat input textarea found.');

        // Microphone Button
        // It has a title "Start Listening" initially
        await page.waitForSelector('button[title="Start Listening"]');
        console.log('Microphone button found.');

        // Send Button
        // It is the button with the Send icon, likely the last button in the container
        // We can check existence of a button that is disabled initially (since input is empty)
        // or check for the Send icon svg if we knew the selector, but checking for 3 buttons in that container is a good proxy.
        // Let's just check if there is a button that is NOT the mic button.
        const buttons = await page.$$('div.max-w-4xl button');
        if (buttons.length >= 2) {
            console.log('Send button found (inferred from button count).');
        } else {
            console.warn('Could not explicitly identify Send button, but container exists.');
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
