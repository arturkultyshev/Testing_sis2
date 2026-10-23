import { test as base, expect } from '@playwright/test';
import { billingAddress, createUser, type User } from '../data/user.factory';
import { LoginPage } from '../pages/login.page';
import { RegisterPage } from '../pages/register.page';
import { CatalogPage } from '../pages/catalog.page';
import { ProductPage } from '../pages/product.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutPage } from '../pages/checkout.page';
import { ResetPasswordPage } from '../pages/reset-password.page';

type Fixtures = {
  newUser: User;
  registeredUser: User;
  loginPage: LoginPage;
  registerPage: RegisterPage;
  catalogPage: CatalogPage;
  productPage: ProductPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  resetPasswordPage: ResetPasswordPage;
  evidence: void;
};

export const test = base.extend<Fixtures>({
  newUser: async ({}, use) => { await use(createUser()); },
  registeredUser: async ({ playwright, newUser }, use) => {
    const api = await playwright.request.newContext({
      baseURL: process.env.API_URL || 'https://api.practicesoftwaretesting.com',
    });
    try {
      // Use an address supported by the demo's own lookup service. Its faker
      // driver does not necessarily return the real city for a postal code.
      const lookup = await api.get('/postcode-lookup', {
        params: { country: billingAddress.country, postcode: billingAddress.postal_code, house_number: billingAddress.house_number },
      });
      expect(lookup.status(), 'Resolve a supported test address').toBe(200);
      const address = await lookup.json() as {
        street: string; house_number: string; city: string; state: string; country: string; postcode: string;
      };
      const user: User = { ...newUser, address: {
        street: address.street, house_number: address.house_number,
        city: address.city, state: address.state, country: address.country, postal_code: address.postcode,
      } };
      const response = await api.post('/users/register', { data: user });
      expect(response.status(), `Test account setup failed: ${await response.text()}`).toBe(201);
      await use(user);
      // Deleting users requires an admin role. Do not use shared admin credentials.
    } finally {
      await api.dispose();
    }
  },
  loginPage: async ({ page }, use) => { await use(new LoginPage(page)); },
  registerPage: async ({ page }, use) => { await use(new RegisterPage(page)); },
  catalogPage: async ({ page }, use) => { await use(new CatalogPage(page)); },
  productPage: async ({ page }, use) => { await use(new ProductPage(page)); },
  cartPage: async ({ page }, use) => { await use(new CartPage(page)); },
  checkoutPage: async ({ page }, use) => { await use(new CheckoutPage(page)); },
  resetPasswordPage: async ({ page }, use) => { await use(new ResetPasswordPage(page)); },
  evidence: [async ({ page }, use, testInfo) => {
    await use();
    if (!page.isClosed()) {
      await testInfo.attach('final-page', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
    }
  }, { auto: true }],
});

export { expect } from '@playwright/test';
