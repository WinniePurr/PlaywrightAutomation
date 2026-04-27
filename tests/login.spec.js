// // Import Playwright test utilities and the LoginPage POM
import { test, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage';

// loginPage is declared here so it is accessible across all tests in this file
let loginPage;

// Before each test, create a new LoginPage instance and navigate to the login page
test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await page.goto('https://www.saucedemo.com/');
});

// This test suite contains tests related to the login functionality of the application
test.describe('Login Tests', () => {

    // Happy Path Test: Verify that a user can log in successfully with valid credentials
    test('should login successfully with valid credentials', async ({ page }) => {
        await loginPage.login('standard_user', 'secret_sauce');
        // Assert that the user is redirected to the inventory page
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    });

    // Negative Test: Invalid Credentials - Verify that an error message is displayed when a user attempts to log in with invalid credentials
    test('should show error message with invalid password', async ({ page }) => {
        await loginPage.login('standard_user', 'wrong_password');
        // Assert that the error message is displayed and contains the expected text
        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toHaveText('Epic sadface: Username and password do not match any user in this service');
        // Assert that the user is NOT redirected to the inventory page and remains on the main login page
        await expect(page).toHaveURL('https://www.saucedemo.com/');

    });

    // Negative Test: Empty Credentials - Verify that an error message is displayed when a user attempts to log in without entering any credentials
    test('should show error message with empty username and password', async ({ page }) => {
        await loginPage.login('', '');
        // Assert that the error message is displayed and contains the expected text
        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toHaveText('Epic sadface: Username is required');
        // Assert that the user is NOT redirected to the inventory page and remains on the main login page
        await expect(page).toHaveURL('https://www.saucedemo.com/');
    });
   
});