import { test, expect } from '../fixtures/pages.fixture';
import { malformedEmail } from '../data/user.factory';

test.describe('Password reset', () => {
  test('RESET-01: a known email receives the reset confirmation', async ({ registeredUser, resetPasswordPage }) => {
    await resetPasswordPage.open();
    expect(await resetPasswordPage.requestReset(registeredUser.email)).toBe(200);
    await resetPasswordPage.expectConfirmation();
  });

  test('RESET-02: an unknown email receives an explicit error', async ({ newUser, resetPasswordPage }) => {
    await resetPasswordPage.open();
    expect(await resetPasswordPage.requestReset(newUser.email)).toBe(422);
    await resetPasswordPage.expectUnknownEmailError();
  });

  test('RESET-03: a malformed email is rejected before a reset can be submitted', async ({ resetPasswordPage }) => {
    await resetPasswordPage.open();
    await resetPasswordPage.attemptMalformedReset(malformedEmail);
    await resetPasswordPage.expectMalformedEmailRejected();
  });
});
