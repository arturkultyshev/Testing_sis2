import { test, expect } from '../fixtures/pages.fixture';
import { products } from '../data/products';

test.describe('Product comparison', () => {
  test('COMPARE-01: Combination Pliers cost more than Pliers', async ({ catalogPage, productPage }, testInfo) => {
    await catalogPage.openProduct(products.combinationPliers);
    const combination = await productPage.readDetails(products.combinationPliers);
    await catalogPage.openProduct(products.pliers);
    const pliers = await productPage.readDetails(products.pliers);
    expect(combination.name).toBe(products.combinationPliers);
    expect(pliers.name).toBe(products.pliers);
    expect(combination.priceInCents).toBeGreaterThan(0);
    expect(pliers.priceInCents).toBeGreaterThan(0);
    expect(combination.priceInCents).toBeGreaterThan(pliers.priceInCents);
    await testInfo.attach('captured-product-comparison', {
      body: JSON.stringify({ combination, pliers }, null, 2), contentType: 'application/json',
    });
  });
});
