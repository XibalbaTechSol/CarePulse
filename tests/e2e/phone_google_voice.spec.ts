import { test, expect } from '@playwright/test';

test.describe('Phone Module (Google Voice Inspiration)', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/dashboard/phone');
    });

    test('should display phone sidebar with navigation items', async ({ page }) => {
        // Sidebar items are icon-only with titles
        await expect(page.locator('button[title="Calls"]')).toBeVisible();
        await expect(page.locator('button[title="Messages"]')).toBeVisible();
        await expect(page.locator('button[title="Voicemail"]')).toBeVisible();
        await expect(page.locator('button[title="Settings"]')).toBeVisible();
    });

    test('should show search bar and status badge', async ({ page }) => {
        await expect(page.getByPlaceholder('Search Google Voice')).toBeVisible();
        await expect(page.locator('text=Active').or(page.locator('text=Inactive'))).toBeVisible();
    });

    test('should show recent calls list', async ({ page }) => {
        // Calls list is default view
        await expect(page.locator('text=Alyssa G Voice')).toBeVisible();
        await expect(page.locator('text=LilMike')).toBeVisible();
    });

    test('should show integrated dialer', async ({ page }) => {
        const dialer = page.locator('div').filter({ hasText: '123456789' }).last();
        await expect(dialer).toBeVisible();
        await expect(page.locator('button', { hasText: 'Call' })).toBeVisible();
    });

    test('should switch to settings tab', async ({ page }) => {
        await page.locator('button[title="Settings"]').click();
        await expect(page.locator('text=SIP Configuration')).toBeVisible();
    });
});
