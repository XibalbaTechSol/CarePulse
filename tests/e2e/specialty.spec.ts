import { test, expect } from '@playwright/test';

test.describe('Specialty Care Modules', () => {

    test('Oncology Module', async ({ page }) => {
        await page.goto('/dashboard/specialty/oncology');
        await expect(page.getByText('Oncology', { exact: true }).first()).toBeVisible();
        await expect(page.getByText('Active Patients')).toBeVisible();
        await expect(page.getByText('Active Treatments')).toBeVisible();
    });

    test('Maternal & Neonatal Module', async ({ page }) => {
        await page.goto('/dashboard/specialty/maternal');
        await expect(page.getByText('Maternal & Neonatal', { exact: true }).first()).toBeVisible();
        await expect(page.getByText('NICU Status')).toBeVisible();
        await expect(page.getByText('Partogram')).toBeVisible();
    });

    test('Wound Care Module', async ({ page }) => {
        await page.goto('/dashboard/specialty/wound-care');
        await expect(page.getByText('Wound Care', { exact: true }).first()).toBeVisible();
        await expect(page.getByText('Healing Progression')).toBeVisible();
    });

});
