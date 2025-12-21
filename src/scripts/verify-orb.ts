import puppeteer from 'puppeteer';
import path from 'path';

async function verifyOrb() {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', (err: any) => console.log('PAGE ERROR:', err.toString()));

    try {
        console.log('Navigating to /dashboard/ai...');
        // Increase timeout for possible cold starts
        await page.goto('http://localhost:3000/dashboard/ai', { waitUntil: 'networkidle0', timeout: 60000 });

        console.log('Checking for Orb component (should be visible by default)...');

        // Log header text to debug button state
        const headerText = await page.evaluate(() => {
            const header = document.querySelector('.border-b');
            return header ? header.textContent : 'Header not found';
        });
        console.log('Header text:', headerText);

        // Check if orb is already there
        try {
            await page.waitForSelector('gdm-live-audio', { timeout: 10000 });
            console.log('Orb component found immediately!');
        } catch (e) {
            console.log('Orb not found initially (timeout), trying to toggle...');
            // Look for Voice Mode button
            const button = await page.waitForSelector('xpath///button[contains(text(), "Voice Mode")]', { timeout: 5000 });
            if (button) {
                await button.click();
                await page.waitForSelector('gdm-live-audio', { timeout: 5000 });
                console.log('Orb component found after toggle!');
            } else {
                throw new Error('Neither Orb nor Voice Mode button found');
            }
        }

        console.log('Orb component found!');

        // Take a screenshot
        const screenshotPath = path.resolve(process.cwd(), 'orb-verification.png');
        await page.screenshot({ path: screenshotPath });
        console.log(`Screenshot saved to ${screenshotPath}`);

    } catch (error) {
        console.error('Verification failed:', error);
        console.log('Current URL:', page.url());
        const errorScreenshotPath = path.resolve(process.cwd(), 'orb-verification-error.png');
        await page.screenshot({ path: errorScreenshotPath });
        console.log(`Error screenshot saved to ${errorScreenshotPath}`);
        process.exit(1);
    } finally {
        await browser.close();
    }
}

verifyOrb();
