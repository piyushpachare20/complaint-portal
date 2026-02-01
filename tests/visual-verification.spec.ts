import { test, expect } from '@playwright/test';

test.describe('Visual Verification', () => {
    test('should navigate through main pages correctly', async ({ page }) => {
        // 1. Landing Page
        await page.goto('/');
        await expect(page).toHaveTitle(/ComplaintPortal/i);
        await expect(page.getByRole('heading', { name: /Report Issues/i })).toBeVisible(); // Wait for loading to finish
        await page.screenshot({ path: 'screenshots/1-landing-page.png', fullPage: true });
        console.log('✅ Captured Landing Page');

        // 2. Navigation to Login
        await page.getByRole('link', { name: 'Log In', exact: true }).first().click();
        await expect(page).toHaveURL(/.*login/);
        await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();
        await page.screenshot({ path: 'screenshots/2-login-page.png', fullPage: true });
        console.log('✅ Captured Login Page');

        // 3. Signup (Navigation from Login)
        await page.getByRole('button', { name: 'Sign Up' }).click();
        await expect(page).toHaveURL(/.*signup/);
        await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible();
        await page.screenshot({ path: 'screenshots/3-signup-page.png', fullPage: true });
        console.log('✅ Captured Signup Page');

        // 4. New Complaint Page
        await page.goto('/complaint/new');
        await page.waitForTimeout(2000); // Wait for hydration
        await page.screenshot({ path: 'screenshots/4-new-complaint-page.png', fullPage: true });
        console.log('✅ Captured New Complaint Page');

    });
});
