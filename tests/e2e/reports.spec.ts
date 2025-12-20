import { test, expect } from '@playwright/test';

test.describe('Reports Module', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/dashboard/reports');
    });

    test('should load Reports Dashboard', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Reports & BI' })).toBeVisible();
    });

    test('should display Intelligence Engine status', async ({ page }) => {
        await expect(page.getByText('Agency Health v2.4')).toBeVisible();
        await expect(page.getByText('Active Patients')).toBeVisible();
    });

    test('should display Report Library', async ({ page }) => {
        // Check for table headers or content
        await expect(page.getByText('Report Name')).toBeVisible();
        await expect(page.getByText('Monthly Revenue by Payer')).toBeVisible();
    });
});
