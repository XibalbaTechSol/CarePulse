import { test, expect } from '@playwright/test';

test.describe('Fax Module (SrFax Inspiration)', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/dashboard/fax');
    });

    test('should display professional action bar', async ({ page }) => {
        await expect(page.locator('h1', { hasText: 'Digital Fax' })).toBeVisible();
        await expect(page.locator('button', { hasText: 'Inbox' })).toBeVisible();
        await expect(page.locator('button[title="New Fax"]')).toBeVisible();
    });

    test('should show Received Faxes by default', async ({ page }) => {
        // Wait for loading to finish if necessary
        await expect(page.locator('text=Received Faxes')).toBeVisible();
    });

    test('should switch to Sent tab', async ({ page }) => {
        await page.locator('button', { hasText: 'Sent' }).click();
        await expect(page.locator('text=Sent Faxes')).toBeVisible();
    });

    test('should switch to Compose view', async ({ page }) => {
        await page.locator('button[title="New Fax"]').click();
        await expect(page.locator('h2', { hasText: 'Compose New Fax' })).toBeVisible();
        await expect(page.locator('text=Recipient Number')).toBeVisible();
        await expect(page.locator('label', { hasText: 'Priority' })).toBeVisible();
        await expect(page.locator('button', { hasText: 'Queue Fax for Delivery' })).toBeVisible();
    });

    test('should show account status and quick actions', async ({ page }) => {
        await expect(page.locator('text=Account Status')).toBeVisible();
        await expect(page.locator('text=Quick Actions')).toBeVisible();
        // Check for usage text or infinity symbol
        await expect(page.locator('text=Usage this month')).toBeVisible();
    });
});
