import { test, expect } from '@playwright/test';

test.describe('Settings & Module Management', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/dashboard/settings');
    });

    test('should display module management toggles', async ({ page }) => {
        const moduleSection = page.locator('.glass').filter({ hasText: 'Module Management' }).first();
        await expect(moduleSection).toBeVisible();

        const toggles = page.locator('[data-testid^="toggle-"]');
        await expect(toggles).toHaveCount(5); // CRM, Email, VoIP, Fax, Storage
    });

    test('should show configuration forms', async ({ page }) => {
        // Only SRFax config is visible by default in settings/page.tsx
        await expect(page.locator('h3', { hasText: 'SRFax Configuration' })).toBeVisible();
    });

    test('should save fax credentials', async ({ page }) => {
        const faxSection = page.locator('.glass').filter({ hasText: 'SRFax Configuration' });
        await faxSection.locator('input[placeholder="e.g. 123456"]').fill('123456');
        await faxSection.locator('input[type="password"]').fill('testpassword');

        const saveBtn = faxSection.locator('button', { hasText: /Update SRFax Credentials/ });
        await expect(saveBtn).toBeVisible();
    });
});
