import { test, expect } from '@playwright/test';

test.describe('VoIP Phone Module', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/dashboard');
    });

    test('should show floating dialer button', async ({ page }) => {
        const dialerBtn = page.getByTestId('floating-dialer-btn');
        await expect(dialerBtn).toBeVisible();
    });

    test('should open dialer and show keypad', async ({ page }) => {
        const dialerBtn = page.getByTestId('floating-dialer-btn');
        await dialerBtn.click();

        // Wait for dialer container
        // Wait for dialer container - The glass container with "Dialer" text that is NOT the widget or log
        // Using a more specific selector
        const dialer = page.locator('.glass').filter({ hasText: '123456789' }); // Keypad numbers
        await expect(dialer).toBeVisible();

        // Check for keypad buttons using testids
        await expect(page.getByTestId('keypad-1')).toBeVisible();
        await expect(page.locator('button', { hasText: 'Call' })).toBeVisible();
    });
});
