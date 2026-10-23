import { expect } from '@playwright/test';
import type { User } from '../data/user.factory';
import { BasePage } from './base.page';

export class RegisterPage extends BasePage {
  async open(): Promise<void> {
    await this.page.goto('/auth/register', { waitUntil: 'domcontentloaded' });
    await expect(this.page.getByTestId('register-form')).toBeVisible();
  }

  async register(user: User): Promise<void> {
    await this.page.getByTestId('first-name').fill(user.first_name);
    await this.page.getByTestId('last-name').fill(user.last_name);
    await this.page.getByTestId('dob').fill(user.dob);
    // KZ permits manual address entry; NL checkout uses the postcode lookup.
    await this.page.getByTestId('country').selectOption(user.address.country);
    await this.page.getByTestId('postal_code').fill(user.address.postal_code);
    await this.page.getByTestId('house_number').fill(user.address.house_number);
    await this.page.getByTestId('street').fill(user.address.street);
    await this.page.getByTestId('city').fill(user.address.city);
    await this.page.getByTestId('state').fill(user.address.state);
    await this.page.getByTestId('phone').fill(user.phone);
    await this.page.getByTestId('email').fill(user.email);
    await this.page.getByTestId('password').fill(user.password);
    const response = this.page.waitForResponse(r =>
      r.url().endsWith('/users/register') && r.request().method() === 'POST');
    await this.page.getByTestId('register-submit').click();
    expect((await response).status(), 'Registration API must create the account').toBe(201);
    await expect(this.page).toHaveURL(/\/auth\/login$/);
  }
}
