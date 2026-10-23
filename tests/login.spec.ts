import { test, expect } from '../fixtures/pages.fixture';
import { invalidPassword } from '../data/user.factory';

test.describe('Login', () => {
  test('LOGIN-01: valid credentials open the account page', async ({ registeredUser, loginPage, page }) => {
    await loginPage.open();
    await loginPage.signIn(registeredUser);
    await expect(page).toHaveURL(/\/account$/);
    await loginPage.expectSignedInAs(registeredUser.first_name, registeredUser.last_name);
  });

  test('LOGIN-02: an incorrect password shows an error and keeps the customer signed out', async ({ registeredUser, loginPage }) => {
    await loginPage.open();
    await loginPage.signIn({ email: registeredUser.email, password: invalidPassword });
    await loginPage.expectInvalidCredentials();
  });
});
