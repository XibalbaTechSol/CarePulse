import { test, expect } from '@playwright/test';

test.describe('EVV Module', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/dashboard/evv');
    });

    test('should load EVV Console', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'EVV & Console' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Export Aggregator Logs' })).toBeVisible();
    });

    test('should display Map and Stats', async ({ page }) => {
        // Leaflet container check
        const map = page.locator('.leaflet-container');
        await expect(map).toBeAttached();

        // Verify Stats/Exceptions
        await expect(page.getByText('Compliance Rating')).toBeVisible();
    });
});
