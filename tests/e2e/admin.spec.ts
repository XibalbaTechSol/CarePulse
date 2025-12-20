import { test, expect } from '@playwright/test';

test.describe('Admin Module', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/dashboard/admin');
    });

    test('should load Admin Dashboard', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Organization Admin' })).toBeVisible();
    });

    test('should display User Management interface', async ({ page }) => {
        await expect(page.getByRole('button', { name: 'Add User' })).toBeVisible();
        // Check if table mock or Real data is present, usually at least headers
        await expect(page.getByRole('columnheader', { name: 'Name' })).toBeVisible();
        await expect(page.getByRole('columnheader', { name: 'Role' })).toBeVisible();
    });
});
