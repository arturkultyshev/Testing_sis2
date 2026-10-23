import { test, expect } from '../fixtures/pages.fixture';
import { products } from '../data/products';

test.describe('Purchase', () => {
  test('BUY-01: two units reach the cart with correct totals and a confirmed order', async ({
    registeredUser, loginPage, catalogPage, productPage, cartPage, checkoutPage, page,
  }) => {
    await loginPage.open();
    await loginPage.signIn(registeredUser);
    await expect(page).toHaveURL(/\/account$/);
    await catalogPage.openProduct(products.combinationPliers);
    const product = await productPage.readDetails(products.combinationPliers);
    await productPage.addToCart(2);
    await productPage.openCart();
    await cartPage.expectItem(product, 2);
    await cartPage.proceedToCheckout();
    await checkoutPage.confirmBillingAddress(registeredUser.address);
    const invoiceNumber = await checkoutPage.placeCashOnDeliveryOrder();
    expect(invoiceNumber).toMatch(/^INV-\d+$/);
  });
});
