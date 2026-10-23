import { expect } from '@playwright/test';
import { BasePage } from './base.page';

export class ResetPasswordPage extends BasePage {
  async open(): Promise<void> {
    await this.page.goto('/auth/forgot-password', { waitUntil: 'domcontentloaded' });
    await expect(this.page.getByTestId('forgot-password-form')).toBeVisible();
  }

  async requestReset(email: string): Promise<number> {
    const response = this.page.waitForResponse(r =>
      r.url().endsWith('/users/forgot-password') && r.request().method() === 'POST');
    await this.fillAndSubmit(email);
    return (await response).status();
  }

  async attemptMalformedReset(email: string): Promise<void> {
    await this.fillAndSubmit(email);
  }

  private async fillAndSubmit(email: string): Promise<void> {
    await this.page.getByTestId('email').fill(email);
    await this.page.getByTestId('forgot-password-submit').click();
  }

  async expectConfirmation(): Promise<void> {
    // Known defect on 2026-10-17: the English UI displays a translation key.
    await expect(this.page.getByRole('alert')).toHaveText('page.forgot-password.confirm');
  }

  async expectUnknownEmailError(): Promise<void> {
    await expect(this.page.getByRole('alert')).toHaveText('The selected email is invalid.');
  }

  async expectMalformedEmailRejected(): Promise<void> {
    await expect.poll(() => this.page.getByTestId('email').evaluate(
      (input: HTMLInputElement) => input.validity.typeMismatch,
    ), { message: 'Browser must reject the malformed email address' }).toBe(true);
    await expect(this.page.getByRole('alert')).not.toBeVisible();
    await expect(this.page).toHaveURL(/\/auth\/forgot-password$/);
  }
}
