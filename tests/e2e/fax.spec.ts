import { test, expect } from '@playwright/test';

test.describe('Digital Fax Module', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/dashboard/fax');
    });

    test('should display Fax History header', async ({ page }) => {
        const historyHeader = page.locator('h2', { hasText: 'Fax History' });
        await expect(historyHeader).toBeVisible();
    });

    test('should show send fax form', async ({ page }) => {
        const composer = page.locator('.glass').filter({ hasText: 'Send New Fax' });
        await expect(composer).toBeVisible();
        await expect(composer.locator('input[placeholder="+1 (555) 000-0000"]')).toBeVisible();
        await expect(composer.locator('button', { hasText: 'Queue Fax for Delivery' })).toBeVisible();
    });
});
