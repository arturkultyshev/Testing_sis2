import { expect, type Page } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async expectSignedInAs(firstName: string, lastName: string): Promise<void> {
    await expect(this.page.getByTestId('nav-menu')).toHaveText(`${firstName} ${lastName}`);
    await expect(this.page.getByTestId('nav-sign-in')).not.toBeVisible();
  }

  async expectSignedOut(): Promise<void> {
    await expect(this.page.getByTestId('nav-sign-in')).toBeVisible();
    await expect(this.page.getByTestId('nav-menu')).not.toBeVisible();
  }
}
