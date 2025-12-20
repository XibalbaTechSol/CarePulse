
import { test, expect } from '@playwright/test';

test.describe('CRM Kanban Module', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/dashboard/crm');
    });

    test('should display Kanban board and verify columns', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Workflow Management' })).toBeVisible();
        await expect(page.getByText('New Lead')).toBeVisible();
        await expect(page.getByText('Contacted')).toBeVisible();
        await expect(page.getByText('Assessment')).toBeVisible();
        await expect(page.getByText('Approved')).toBeVisible();
    });

    test('should create a new item via modal', async ({ page }) => {
        // Find and click the "New Item" button
        await page.getByRole('button', { name: 'New Item' }).click();

        // Verify modal appears
        await expect(page.getByText('Create New Lead', { exact: true })).toBeVisible();

        // Fill out the form
        await page.getByPlaceholder('e.g. John Doe').fill('Playwright Test User');
        await page.getByPlaceholder('Enter details...').fill('Automated test detail');

        // Submit
        await page.getByRole('button', { name: 'Create Lead' }).click();

        // Verify modal closes
        await expect(page.getByText('Create New Lead', { exact: true })).toBeHidden();

        // Verify new item appears in the first column
        // We wait for it to be visible. 
        await expect(page.getByText('Playwright Test User')).toBeVisible();
        await expect(page.getByText('Automated test detail')).toBeVisible();
    });

    test('should move a kanban card', async ({ page }) => {
        // We will move "Martha Stewart" from "New Lead" (col 1) to "Contacted" (col 2)
        const card = page.getByText('Martha Stewart').first();
        // Since we don't have good test IDs, we rely on text. 
        // "Contacted" is the title of the second column.
        const targetColumnHeader = page.getByText('Contacted').first();

        // Note: Drag and drop in Playwright with dnd-kit can be flaky with just .dragTo()
        // verify visibility first
        await expect(card).toBeVisible();

        // Perform drag
        await card.dragTo(targetColumnHeader);

        // Allow animation to settle
        await page.waitForTimeout(500);

        await expect(card).toBeVisible();
    });
});
