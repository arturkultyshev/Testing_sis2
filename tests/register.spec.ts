import { test, expect } from '../fixtures/pages.fixture';

test.describe('Registration', () => {
  test('REG-01: a unique new customer can register and then sign in', async ({ newUser, registerPage, loginPage, page }) => {
    await registerPage.open();
    await registerPage.register(newUser);
    await expect(page).toHaveURL(/\/auth\/login$/);
    // A redirect alone does not prove that the submitted credentials work.
    await loginPage.signIn(newUser);
    await expect(page).toHaveURL(/\/account$/);
    await loginPage.expectSignedInAs(newUser.first_name, newUser.last_name);
  });
});
