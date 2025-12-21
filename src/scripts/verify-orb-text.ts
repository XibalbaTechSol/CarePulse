
import puppeteer from 'puppeteer';
import path from 'path';

async function verifyOrbText() {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Log console messages
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    try {
        console.log('Navigating to /dashboard/ai...');
        await page.goto('http://localhost:3000/dashboard/ai', { waitUntil: 'domcontentloaded', timeout: 90000 });

        // Ensure we are in Voice Mode
        try {
            await page.waitForSelector('gdm-live-audio', { timeout: 5000 });
            console.log('Orb found immediately.');
        } catch {
            console.log('Orb not found, clicking Voice Mode...');
            const button = await page.waitForSelector('xpath///button[contains(text(), "Voice Mode")]', { timeout: 5000 });
            if (button) await button.click();
            await page.waitForSelector('gdm-live-audio', { timeout: 5000 });
        }

        // Wait for Shadow DOM to populate
        await page.waitForFunction(() => {
            const orb = document.querySelector('gdm-live-audio');
            return orb && orb.shadowRoot && orb.shadowRoot.querySelector('gdm-live-audio-visuals-3d');
        }, { timeout: 5000 }).catch(() => console.log('Timeout waiting for Shadow DOM visuals'));

        // Debug: Check Orb Visibility
        await page.evaluate(() => {
            const orb = document.querySelector('gdm-live-audio');
            if (orb) {
                const rect = orb.getBoundingClientRect();
                console.log(`Orb Size: ${rect.width}x${rect.height} at (${rect.top}, ${rect.left})`);
                const style = window.getComputedStyle(orb);
                console.log(`Orb Computed Style: display=${style.display}, visibility=${style.visibility}, position=${style.position}`);

                // Check Shadow Root content dimensions
                /* @ts-ignore */
                if (orb.shadowRoot) {
                    /* @ts-ignore */
                    const visual = orb.shadowRoot.querySelector('gdm-live-audio-visuals-3d');
                    if (visual) {
                        const vRect = visual.getBoundingClientRect();
                        console.log(`Visual 3D Size: ${vRect.width}x${vRect.height}`);
                    } else {
                        console.log('Visual 3D element NOT found in Shadow Root');
                        console.log('Shadow Root HTML:', orb.shadowRoot.innerHTML);
                    }
                }
            }
        });

        console.log('Simulating AI Text event...');
        await page.evaluate(() => {
            const orb = document.querySelector('gdm-live-audio');
            if (orb) {
                orb.dispatchEvent(new CustomEvent('ai-text', {
                    detail: { text: 'Hello from AI' },
                    bubbles: true,
                    composed: true
                }));
            } else {
                throw new Error('Orb element not found in evaluate');
            }
        });

        console.log('Waiting for AI text to appear...');
        await page.waitForSelector('xpath///div[contains(text(), "Hello from AI")]', { timeout: 2000 });
        console.log('AI Text verified!');

        console.log('Simulating User Text event...');
        await page.evaluate(() => {
            const orb = document.querySelector('gdm-live-audio');
            if (orb) {
                orb.dispatchEvent(new CustomEvent('user-text', {
                    detail: { text: 'Hello from User' },
                    bubbles: true,
                    composed: true
                }));
            }
        });

        console.log('Waiting for User text to appear...');
        await page.waitForSelector('xpath///div[contains(text(), "Hello from User")]', { timeout: 2000 });
        console.log('User Text verified!');

        // Take a screenshot
        const screenshotPath = path.resolve(process.cwd(), 'orb-text-verification.png');
        await page.screenshot({ path: screenshotPath });
        console.log(`Screenshot saved to ${screenshotPath}`);

    } catch (error) {
        console.error('Verification failed:', error);
        const errorScreenshotPath = path.resolve(process.cwd(), 'orb-text-error.png');
        await page.screenshot({ path: errorScreenshotPath });
        process.exit(1);
    } finally {
        await browser.close();
    }
}

verifyOrbText();
