import { expect } from '@playwright/test';
import { formatUSD } from '../data/products';
import type { ProductDetails } from './product.page';
import { BasePage } from './base.page';

export class CartPage extends BasePage {
  async expectItem(product: ProductDetails, quantity: number): Promise<void> {
    await expect(this.page.getByTestId('product-title')).toHaveCount(1);
    await expect(this.page.getByTestId('product-title')).toHaveText(product.name);
    await expect(this.page.getByTestId('product-quantity')).toHaveValue(String(quantity));
    await expect(this.page.getByTestId('product-price')).toHaveText(formatUSD(product.priceInCents));
    await expect(this.page.getByTestId('line-price')).toHaveText(formatUSD(product.priceInCents * quantity));
    await expect(this.page.getByTestId('cart-total')).toHaveText(formatUSD(product.priceInCents * quantity));
  }

  async proceedToCheckout(): Promise<void> {
    await this.page.getByTestId('proceed-1').click();
    await expect(this.page.getByTestId('proceed-2')).toBeVisible();
  }
}
