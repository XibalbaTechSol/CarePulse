import { test, expect } from '@playwright/test';

test.describe('Clinical Module', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/dashboard/clinical');
    });

    test('should load Clinical Dashboard', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Clinical documentation' })).toBeVisible();
    });

    test('should display Patient Information', async ({ page }) => {
        await expect(page.getByText('Robert Miller')).toBeVisible();
        await expect(page.getByText('ID: #882199')).toBeVisible();
    });

    test('should navigate tabs', async ({ page }) => {
        const assessmentTab = page.getByRole('button', { name: 'Assessments' });
        const marTab = page.getByRole('button', { name: 'Med MAR' });

        await expect(assessmentTab).toBeVisible();
        await expect(marTab).toBeVisible();

        // Default tab content
        await expect(page.getByText('Primary Diagnosis')).toBeVisible();

        // Switch to MAR
        await marTab.click();
        await expect(page.getByText('Lisinopril', { exact: true })).toBeVisible();
    });
});
