import { test, expect } from '@playwright/test';

test.describe('Dashboard Module', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/dashboard');
    });

    test('should load Dashboard Overview', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Your Dashboard' })).toBeVisible();
        await expect(page.getByText('Welcome back')).toBeVisible();
    });

    test('should display default widgets', async ({ page }) => {
        // Morning Coffee Widget (Look for content inside it)
        await expect(page.getByText('MISSED VISITS')).toBeVisible();
        await expect(page.getByText('EXPIRING AUTHS')).toBeVisible();
    });
});
