import { test, expect } from '@playwright/test';

test.describe('Billing Module (T1019)', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/dashboard/billing');
    });

    test('should load Billing Dashboard', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Billing & AR' })).toBeVisible();
    });

    test('should display KPI cards', async ({ page }) => {
        await expect(page.getByText('Total Receivables')).toBeVisible();
        await expect(page.getByText('vs Last Month', { exact: false })).toBeVisible();
    });

    test('should display Claims Table', async ({ page }) => {
        await expect(page.getByText('Processing Queue')).toBeVisible();
        // Check for table headers
        await expect(page.getByText('Patient & ID')).toBeVisible();
    });
});
