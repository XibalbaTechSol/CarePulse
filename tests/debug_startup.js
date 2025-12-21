const puppeteer = require('puppeteer');

(async () => {
  console.log('--- DEBUG: Starting Browser Capture ---');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  // Capture console logs
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.toString()));
  page.on('response', response => {
      if (response.status() >= 400) {
          console.log(`HTTP ERROR: ${response.status()} ${response.url()}`);
      }
  });

  try {
    const url = 'http://localhost:3000';
    console.log(`Navigating to ${url}...`);
    // Wait for network idle to ensure hydration might have happened
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Wait a bit more for hydration/client-side logs
    await new Promise(r => setTimeout(r, 2000));

    const title = await page.title();
    console.log(`Page Title: ${title}`);

    const html = await page.content();
    console.log('--- DOM SNAPSHOT START ---');
    console.log(html);
    console.log('--- DOM SNAPSHOT END ---');

  } catch (e) {
    console.error('Debug script failed:', e);
  } finally {
    await browser.close();
    console.log('--- DEBUG: Finished ---');
  }
})();
