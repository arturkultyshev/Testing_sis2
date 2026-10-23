import { expect } from '@playwright/test';
import type { Address } from '../data/user.factory';
import { BasePage } from './base.page';

export class CheckoutPage extends BasePage {
  async confirmBillingAddress(address: Address): Promise<void> {
    await this.page.getByTestId('proceed-2').click();
    await expect(this.page.getByTestId('country')).toBeVisible();
    // Verify the asynchronously prefilled address before accepting it. Setup
    // uses the same supported address, so later prefills cannot overwrite edits.
    await expect(this.page.getByTestId('country')).toHaveValue(address.country);
    await expect(this.page.getByTestId('postal_code')).toHaveValue(address.postal_code);
    await expect(this.page.getByTestId('house_number')).toHaveValue(address.house_number);
    await expect(this.page.getByTestId('street')).toHaveValue(address.street);
    await expect(this.page.getByTestId('city')).toHaveValue(address.city);
    await expect(this.page.getByTestId('state')).toHaveValue(address.state);
    await expect(this.page.getByTestId('proceed-3')).toBeEnabled();
    await this.page.getByTestId('proceed-3').click();
  }

  async placeCashOnDeliveryOrder(): Promise<string> {
    await this.page.getByTestId('payment-method').selectOption('cash-on-delivery');
    await this.page.getByTestId('finish').click();
    await expect(this.page.getByTestId('payment-success-message')).toHaveText('Payment was successful');
    const invoiceResponse = this.page.waitForResponse(r =>
      new URL(r.url()).pathname === '/invoices' && r.request().method() === 'POST');
    await this.page.getByTestId('finish').click();
    const response = await invoiceResponse;
    expect(response.status(), 'Confirm must create a real demo invoice').toBe(201);
    const invoice = await response.json() as { invoice_number: string };
    const confirmation = this.page.locator('#order-confirmation');
    await expect(confirmation).toBeVisible();
    await expect(confirmation).toContainText(invoice.invoice_number);
    await expect(confirmation).toContainText(/order/i);
    return invoice.invoice_number;
  }
}
