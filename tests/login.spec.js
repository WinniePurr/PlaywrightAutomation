import { test, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage';
import { users, errorMessages } from '../data/users';

let loginPage;

// Navigate to login page and initialise LoginPage before each test
test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await page.goto('https://www.saucedemo.com/');
});

test.describe('Happy Path Login Tests', () => {

    // Valid credentials should redirect to the inventory page
    test('should login successfully with valid credentials', { tag: '@smoke' }, async ({ page }) => {
        await loginPage.login(users.standardUser.username, users.standardUser.password);
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    });
});

test.describe('Negative Path Login Tests', () => {

    // Wrong password for a valid username
    test('should show error message with invalid password', async ({ page }) => {
        await loginPage.login(users.invalidPassword.username, users.invalidPassword.password);
        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toHaveText(errorMessages.invalidCredentialsError);
        await expect(page).toHaveURL('https://www.saucedemo.com/');
    });

    // Username that does not exist in the system
    test('should show error message with non-existent user', async ({ page }) => {
        await loginPage.login(users.nonExistentUser.username, users.nonExistentUser.password);
        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toHaveText(errorMessages.invalidCredentialsError);
        await expect(page).toHaveURL('https://www.saucedemo.com/');
    });

    // Valid credentials but account access has been restricted
    test('should show error message for locked out user', async ({ page }) => {
        await loginPage.login(users.lockedOutUser.username, users.lockedOutUser.password);
        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toHaveText(errorMessages.lockedOutError);
        await expect(page).toHaveURL('https://www.saucedemo.com/');
    });

    // Username field is validated before password
    test('should show error message with empty username and password', async ({ page }) => {
        await loginPage.login(users.emptyCredentials.username, users.emptyCredentials.password);
        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toHaveText(errorMessages.emptyUsernameError);
        await expect(page).toHaveURL('https://www.saucedemo.com/');
    });

    // Username field is required when password is provided
    test('should show error message with empty username', async ({ page }) => {
        await loginPage.login(users.emptyUsername.username, users.emptyUsername.password);
        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toHaveText(errorMessages.emptyUsernameError);
        await expect(page).toHaveURL('https://www.saucedemo.com/');
    });

    // Password field is required when username is provided
    test('should show error message with empty password', async ({ page }) => {
        await loginPage.login(users.emptyPassword.username, users.emptyPassword.password);
        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toHaveText(errorMessages.emptyPasswordError);
        await expect(page).toHaveURL('https://www.saucedemo.com/');
    });

    // Error message should be dismissable when the X button is clicked
    test('should dismiss error message when X is clicked', async ({ page }) => {
        await loginPage.login(users.invalidPassword.username, users.invalidPassword.password);
        await expect(loginPage.errorMessage).toBeVisible();
        await loginPage.errorButton.click();
        await expect(loginPage.errorMessage).not.toBeVisible();
    });

    // Cannot directly navigate to the inventory page without logging in
    test('should not allow navigation to inventory page without logging in', async ({ page }) => {
        await page.goto('https://www.saucedemo.com/inventory.html');
        await expect(page).toHaveURL('https://www.saucedemo.com/');
        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toHaveText(errorMessages.directURLAccessError);
    });

});

test.describe('Recovery Tests', () => {

    // Locked out user should not prevent other users from logging in successfully
    test('should login successfully with valid user after locked out user is rejected', async ({ page }) => {
        await loginPage.login(users.lockedOutUser.username, users.lockedOutUser.password);
        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toHaveText(errorMessages.lockedOutError);
        await expect(page).toHaveURL('https://www.saucedemo.com/');
        await loginPage.login(users.standardUser.username, users.standardUser.password);
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    });

    // Empty credentials attempt should not prevent other users from logging in successfully
    test('should login successfully with valid user after empty credentials are rejected', async ({ page }) => {
        await loginPage.login(users.emptyCredentials.username, users.emptyCredentials.password);
        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toHaveText(errorMessages.emptyUsernameError);
        await expect(page).toHaveURL('https://www.saucedemo.com/');
        await loginPage.login(users.standardUser.username, users.standardUser.password);
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    });

    // Incorrect password attempt should not prevent other users from logging in successfully
    test('should login successfully with valid user after incorrect password is rejected', async ({ page }) => {
        await loginPage.login(users.invalidPassword.username, users.invalidPassword.password);
        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toHaveText(errorMessages.invalidCredentialsError);
        await expect(page).toHaveURL('https://www.saucedemo.com/');
        await loginPage.login(users.invalidPassword.username, users.standardUser.password);
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    });

});
