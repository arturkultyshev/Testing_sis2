import { expect } from '@playwright/test';
import { BasePage } from './base.page';

export class CatalogPage extends BasePage {
  async openProduct(name: string): Promise<void> {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    await this.page.getByTestId('search-query').fill(name);
    await this.page.getByTestId('search-submit').click();
    const product = this.page.getByRole('heading', { name, exact: true });
    await expect(product).toBeVisible();
    await product.click();
    await expect(this.page.getByTestId('product-name')).toHaveText(name);
  }
}
