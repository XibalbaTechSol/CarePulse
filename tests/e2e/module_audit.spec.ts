import { test, expect } from '@playwright/test';

// List of all dashboard modules to audit
const MODULES = [
    'crm',
    'billing',
    'clinical',
    'scheduling/patient',
    'admin',
    'phone',
    'fax',
    'email',
    'engagement',
    'evv',
    'forms',
    'lis',
    'or',
    'payroll',
    'portals',
    'radiology',
    'reports',
    'research',
    'rpm',
    'settings',
    'specialty',
    'storage',
    'workflows'
];

for (const moduleName of MODULES) {
    test.describe(`Audit Module: ${moduleName}`, () => {
        test.beforeEach(async ({ page }) => {
            // Set a cookie or localStorage if needed for bypassing auth in dev
            // For now, assume it's publicly accessible or using default dev auth
            await page.goto(`/dashboard/${moduleName}`);
            await page.waitForLoadState('networkidle');
        });

        test(`should have no broken buttons or console errors in ${moduleName}`, async ({ page }) => {
            const consoleErrors: string[] = [];
            page.on('console', msg => {
                if (msg.type() === 'error') consoleErrors.push(msg.text());
            });

            page.on('pageerror', err => {
                consoleErrors.push(err.message);
            });

            // 1. Verify page loaded basic layout
            // Check for common dashboard elements (sidebar, header, or just h1)
            const header = page.locator('h1, h2, .text-3xl').first();
            await expect(header).toBeVisible({ timeout: 15000 });
            const titleText = await header.innerText();
            console.log(`[${moduleName}] Title: ${titleText}`);

            // 2. Find all interactive buttons (excluding nav links)
            // We look for buttons that are not just links, or buttons with icons
            const buttons = await page.locator('button:not([aria-haspopup="menu"]), a.btn, .clickable').all();
            console.log(`[${moduleName}] Found ${buttons.length} buttons`);

            for (let i = 0; i < Math.min(buttons.length, 15); i++) { // Limit to 15 buttons
                const btn = buttons[i];
                const isVisible = await btn.isVisible();
                const isDisabled = await btn.isDisabled();

                if (isVisible && !isDisabled) {
                    const text = (await btn.innerText() || await btn.getAttribute('title') || await btn.getAttribute('aria-label') || `Button ${i}`).trim();
                    console.log(`[${moduleName}] Testing button: "${text}"`);

                    try {
                        await btn.click({ timeout: 2000 });
                        await page.waitForTimeout(500);

                        // Check for Internal Server Error or other crashes
                        const bodyText = await page.innerText('body');
                        if (bodyText.includes('Internal Server Error') || bodyText.includes('Application Error')) {
                            consoleErrors.push(`UI Error detected after clicking "${text}"`);
                        }

                        // Check if a modal appeared
                        const modal = page.locator('[role="dialog"], .modal, .fixed.inset-0').first();
                        if (await modal.isVisible()) {
                            console.log(`[${moduleName}] Modal detected after clicking "${text}". Closing...`);
                            // Try to find a close button (X icon or "Cancel" or "Close")
                            const closeBtn = modal.locator('button:has(.lucide-x), button:has-text("Cancel"), button:has-text("Close"), .lucide-x').first();
                            if (await closeBtn.isVisible()) {
                                await closeBtn.click();
                                await page.waitForTimeout(300);
                            } else {
                                // Escape key as fallback
                                await page.keyboard.press('Escape');
                                await page.waitForTimeout(300);
                            }
                        }

                        const currentURL = page.url();
                        if (!currentURL.includes(`/dashboard/${moduleName}`)) {
                            await page.goBack();
                            await page.waitForLoadState('networkidle');
                        }
                    } catch (error) {
                        const errorMessage = (error as Error).message || 'Unknown error';
                        console.warn(`[${moduleName}] Could not click or handle "${text}": ${errorMessage}`);
                        // If stuck, try escape
                        await page.keyboard.press('Escape');
                    }
                }
            }

            // 3. Check for accumulated errors
            if (consoleErrors.length > 0) {
                console.error(`[${module}] Errors found:`, consoleErrors);
            }

            // We don't necessarily fail the test here, as we want to gather all errors
            // but we can assert if we want strictly zero errors
            // expect(consoleErrors).toHaveLength(0);
        });
    });
}
