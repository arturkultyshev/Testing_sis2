import { expect } from '@playwright/test';
import type { User } from '../data/user.factory';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  async open(): Promise<void> {
    await this.page.goto('/auth/login', { waitUntil: 'domcontentloaded' });
    await expect(this.page.getByTestId('email')).toBeVisible();
  }

  async signIn(user: Pick<User, 'email' | 'password'>): Promise<void> {
    await this.page.getByTestId('email').fill(user.email);
    await this.page.getByTestId('password').fill(user.password);
    await this.page.getByTestId('login-submit').click();
  }

  async expectInvalidCredentials(): Promise<void> {
    await expect(this.page.getByTestId('login-error')).toHaveText('Invalid email or password');
    await expect(this.page).toHaveURL(/\/auth\/login$/);
    await this.expectSignedOut();
  }
}
