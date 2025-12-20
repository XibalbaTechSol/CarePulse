import { test, expect } from '@playwright/test';

test.describe('File Storage Module', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/dashboard/storage');
    });

    test('should display File Storage header', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'File Storage' })).toBeVisible();
    });

    test('should display file grid', async ({ page }) => {
        // We don't have a test id 'file-grid', we'll check for file names
        await expect(page.locator('text=Annual Report 2024.pdf').first()).toBeVisible();
    });

    test('should show sidebar categories', async ({ page }) => {
        await expect(page.locator('span:has-text("Starred")').first()).toBeVisible();
        await expect(page.locator('span:has-text("My Drive")').first()).toBeVisible();
    });

    test('should show view toggle and new button', async ({ page }) => {
        await expect(page.locator('button:has-text("New")')).toBeVisible();
        // Check for Grid/List icons via their component buttons
        const gridBtn = page.locator('button').filter({ has: page.locator('svg') }).nth(1); // After 'New'
        await expect(gridBtn).toBeVisible();
    });
});
