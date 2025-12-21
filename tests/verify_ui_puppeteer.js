const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const baseURL = 'http://localhost:3000';

    try {
        console.log('--- Verifying Phone Module (Google Voice Style) ---');
        await page.goto(`${baseURL}/dashboard/phone`);
        await page.waitForSelector('text/Voice', { timeout: 5000 });
        
        const sidebarItems = await page.$$eval('.sidebar-item-hover', items => items.map(i => i.innerText));
        console.log('Found Sidebar Items:', sidebarItems.join(', '));
        
        const hasCalls = sidebarItems.some(i => i.includes('Calls'));
        console.log(`Has "Calls" item: ${hasCalls}`);

        const searchPlaceholder = await page.$eval('input[placeholder="Search calls or numbers"]', el => el.placeholder);
        console.log(`Search Bar present with placeholder: ${searchPlaceholder}`);

        console.log('\n--- Verifying Fax Module (SrFax Style) ---');
        await page.goto(`${baseURL}/dashboard/fax`);
        await page.waitForSelector('text/Digital Fax', { timeout: 5000 });

        const tabs = await page.$$eval('button', buttons => buttons.map(b => b.innerText).filter(t => ['Inbox', 'Sent', 'Queued', 'Send New Fax'].some(goal => t.includes(goal))));
        console.log('Found Fax Tabs/Actions:', tabs.join(', '));

        const hasInbox = tabs.some(t => t.includes('Inbox'));
        console.log(`Has "Inbox" tab: ${hasInbox}`);

        const pageTitle = await page.$eval('h1', el => el.innerText);
        console.log(`Page Title: ${pageTitle}`);

        console.log('\nVerification Successful!');
    } catch (error) {
        console.error('Verification Failed:', error);
        process.exit(1);
    } finally {
        await browser.close();
    }
})();
