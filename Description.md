# SIS 2: Test Automation with Playwright

Deadline: 23 October 2026. Application: https://practicesoftwaretesting.com/.

## Objective

Automate five required customer workflows in Toolshop using TypeScript and Playwright Test: registration, login, purchase, comparison of two products, and password reset. The implementation contains five spec files and eight independent test cases. All browser actions run against the real public demo; no application responses are mocked.

## Test cases

### REG-01: Register a new customer

- Preconditions: a fresh browser context and an unregistered UUID-based email.
- Steps: open registration; fill all required fields with synthetic customer details; submit; sign in with the newly registered credentials.
- Expected: registration returns HTTP 201; the UI redirects to login; the new credentials open `/account`; the navigation shows the customer's full name.
- Reason: checking the redirect alone would not prove that the account was created correctly.

### LOGIN-01: Sign in with valid credentials

- Preconditions: a unique customer created by this test's API fixture.
- Steps: open login; enter that customer's email and password; submit.
- Expected: `/account` opens, the customer's full name appears, and the sign-in link disappears.

### LOGIN-02: Reject an incorrect password

- Preconditions: a unique registered customer and a password different from the customer's password.
- Steps: open login; enter the known email and incorrect password; submit.
- Expected: `Invalid email or password` appears; the URL remains `/auth/login`; the customer remains signed out.

### BUY-01: Purchase two units of a product

- Preconditions: a fresh browser context, empty cart, and an independent registered customer with an address supported by the demo's postcode service.
- Steps: sign in; search for Combination Pliers; read the name and current unit price; add two units; open the cart; proceed through sign-in and billing; select Cash on Delivery; check payment; confirm the order.
- Expected: the cart has exactly one product line, the correct product name and quantity 2, the captured unit price, and line/cart totals equal to unit price × 2. Payment succeeds, the API creates an invoice with HTTP 201, and the final UI confirmation contains the same invoice number.
- Data: the fixture resolves a Netherlands address from the real demo API before registering the customer. The billing page verifies all prefilled address fields. The demo's postcode driver can return synthetic addresses.
- Payment: this is the educational demo and its Cash on Delivery option. No real payment details are entered.

### COMPARE-01: Compare two product prices

- Preconditions: a fresh anonymous browser context.
- Steps: search for and open Combination Pliers; capture its name and price; search for and open Pliers; capture its name and price.
- Expected: both names match the requested products, both prices are positive, and Combination Pliers cost more than Pliers.
- Oracle: this is an explicit business comparison, not a claim that arbitrary products always differ in price. Absolute prices and product IDs are not hard-coded. If the catalogue changes this relationship, review the requirement rather than weakening the assertion.
- Evidence: both captured products are attached to the Playwright report as JSON.

### RESET-01: Request a reset for a known email

- Preconditions: this test's own registered customer. Never use a shared seeded account for this operation.
- Steps: open forgot-password; enter the known email; submit.
- Expected: the reset endpoint returns HTTP 200 and the application renders its confirmation alert. On the inspected build, the alert is the untranslated key `page.forgot-password.confirm`.
- Known limitation: this is a characterization of the current build's confirmation. It does not certify that the confirmation is readable English. The translation defect is recorded in Review.md.
- Scope: request and confirmation only. Email delivery and token-based password replacement are outside the brief.

### RESET-02: Reject an unknown email

- Preconditions: a unique generated email which this test does not register.
- Steps: open forgot-password; submit the unknown address.
- Expected: the reset endpoint returns HTTP 422 and the alert says `The selected email is invalid.`

### RESET-03: Reject a malformed email

- Preconditions: a fresh browser context.
- Steps: enter `not-an-email` in forgot-password; attempt to submit.
- Expected: native email validation reports `typeMismatch`; no server-result alert appears; the page stays on forgot-password.
- Reason: malformed and unregistered email addresses exercise different validation paths.

## Independence and implementation rules

- Every test receives its own isolated browser context.
- Test data uses UUID-based email addresses under `example.com` and synthetic names/addresses.
- Registered customers are created per test through the documented API. The registration case itself uses the UI.
- No test reads data or saved authentication created by another test. Password reset cannot break another test's login.
- Five spec files use page objects supplied by custom fixtures. Locator definitions and page paths are inside page objects.
- Assertions use Playwright's retrying expectations. The malformed-email check uses `expect.poll` for native browser validity.
- No fixed sleeps, CSS-class locators, positional XPath, test skipping, or mocked success responses.
- Read product prices from the live UI and compare integer cents to avoid floating-point currency errors.

## Exclusions and operational limits

Only desktop Chromium is configured. OAuth, real email delivery, other payment methods, visual regression, accessibility audits, load/security testing, and the optional deliberately buggy deployment are outside this submission. The public site, its API, and internet access must be available. Dynamic product IDs are discovered through the UI. Customer deletion requires administrator privileges, so synthetic customers and demo invoices remain until the service resets its data.
