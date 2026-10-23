import { expect } from '@playwright/test';
import { moneyInCents } from '../data/products';
import { BasePage } from './base.page';

export interface ProductDetails {
  name: string;
  priceInCents: number;
}

export class ProductPage extends BasePage {
  async readDetails(expectedName: string): Promise<ProductDetails> {
    const name = this.page.getByTestId('product-name');
    const price = this.page.getByTestId('unit-price');
    await expect(name).toHaveText(expectedName);
    await expect(price).toHaveText(/\d+\.\d{2}/);
    return { name: (await name.innerText()).trim(), priceInCents: moneyInCents(await price.innerText()) };
  }

  async addToCart(quantity: number): Promise<void> {
    await this.page.getByTestId('quantity').fill(String(quantity));
    await this.page.getByTestId('add-to-cart').click();
    await expect(this.page.getByTestId('cart-quantity')).toHaveText(String(quantity));
  }

  async openCart(): Promise<void> {
    await this.page.getByTestId('nav-cart').click();
    await expect(this.page.getByTestId('proceed-1')).toBeVisible();
  }
}
