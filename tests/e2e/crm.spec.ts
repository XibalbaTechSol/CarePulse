import { test, expect } from '@playwright/test';

test.describe('CRM Module', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/dashboard/crm');
    });

    test('should display CRM dashboard header', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Workflow Management' })).toBeVisible();
    });

    test('should display Kanban board', async ({ page }) => {
        // Check for Kanban Columns
        await expect(page.getByText('New Lead').first()).toBeVisible();
        await expect(page.getByText('Contacted').first()).toBeVisible();
        await expect(page.getByText('Assessment').first()).toBeVisible();

        // Check for at least one card
        // Using a known card name from `initialData` in CrmKanban.tsx
        await expect(page.getByText('Martha Stewart')).toBeVisible();
    });

    // Remove obsolete tests for Table, Sidebar, CSV Export, Click-to-Call if they don't exist in Kanban
    // CrmKanban has "New Item" and "Customize Board" buttons

    test('should show Action buttons', async ({ page }) => {
        await expect(page.getByRole('button', { name: 'New Item' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Customize Board' })).toBeVisible();
    });
});
