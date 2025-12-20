import { test, expect } from '@playwright/test';

test.describe('Workflows Module', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/dashboard/workflows');
    });

    test('should load Workflow Boards', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Workflow Boards' })).toBeVisible();
    });

    test('should switch between Intake and Auth tabs', async ({ page }) => {
        const intakeTab = page.getByRole('button', { name: 'Client Intake' });
        const authTab = page.getByRole('button', { name: 'Prior Auth' });

        await expect(intakeTab).toBeVisible();
        await expect(authTab).toBeVisible();

        // Verify Default Board (Intake)
        await expect(page.getByRole('heading', { name: 'New Lead' }).first()).toBeVisible();

        // Switch Tab
        await authTab.click();

        // Verify Auth Board columns or content
        await expect(page.getByText('Submitted to Payer')).toBeVisible();
    });
});
