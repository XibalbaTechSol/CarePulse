import { test, expect } from '@playwright/test';

test.describe('Email Module', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/dashboard/email');
    });

    test('should display Email Suite header', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Email Business Suite' })).toBeVisible();
    });

    test('should display emails in inbox or configure message', async ({ page }) => {
        const inboxList = page.getByTestId('email-list');
        await expect(inboxList).toBeVisible({ timeout: 30000 });

        // Since it might be empty if no account is configured
        const content = await inboxList.textContent();
        if (content?.includes('No active email account')) {
            await expect(inboxList).toContainText('Please go to settings');
        } else {
            // Assuming at least one email or loading state
            await expect(inboxList).not.toBeEmpty();
        }
    });

    test('should display email content when selected', async ({ page }) => {
        const item = page.getByTestId(/email-item-/).first();
        if (await item.isVisible()) {
            await item.click();
            const messageView = page.getByTestId('email-message-view');
            await expect(messageView).toBeVisible();
        }
    });
});
