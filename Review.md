# Review of the AI-assisted result

## Authorship and scope of this record

Codex generated this review from the implementation and real tool results in the working session on 17 October 2026. It describes checks actually performed during that session. It is not a claim that the student has already independently reviewed every file. The student must inspect the source, run the suite, and add their own review observations before submission.

## What the AI produced

The AI first explained the assignment, then produced a TypeScript/Playwright project with five spec files and eight tests, page objects, custom fixtures, a UUID-based data factory, runtime configuration, evidence collection and Markdown documentation. The tests run against the real public Toolshop frontend and API. No test stubs the application into returning a successful response.

The AI used the supplied presentation and pasted assignment brief as requirements. The later brief's 23 October deadline takes precedence over the presentation's general week-8 deadline.

## How the output was checked

1. Inspected the live registration, login, forgot-password, catalogue, product, cart and checkout screens using Playwright. Read real `data-test` attributes and accessible names instead of copying guessed tutorial selectors.
2. Inspected the application's public OpenAPI documentation for account setup, postcode lookup, password-reset behavior and customer-deletion permissions.
3. Checked the TypeScript project with `npm run typecheck`.
4. Ran the real UI tests, inspected failures, corrected synchronization and data setup, and reran the affected scenario.
5. Ran the full suite twice with three workers and no retries. The final retained run and screenshots are recorded in `evidence/Run-results.md` and `evidence/run-summary.json`.
6. Checked the specs for direct locator definitions and reviewed the implementation against the lecture restrictions.
7. Copied the project without dependencies, reports or temporary helpers into a separate clean directory. Ran `npm ci --offline` with the actual browser-install postinstall hook, then all eight tests with one worker. All eight passed. The installation used the local npm cache and installed browser; it was a clean project copy, not a separate operating system. Results are in `evidence/clean-install-check.json`.

## Concrete corrections and their reasons

### 1. Wait for actual page content

The first inspection helper waited for a `main` element which this deployment does not provide. Waiting only for the Angular root also returned content before the forms were ready. The inspection was changed to wait for actual form fields or product headings. These inspection helpers are temporary and excluded from the submitted project.

Reason: page readiness must be tied to the content required for the scenario.

### 2. Use the current registration form

The live form has date-of-birth, country, address, house-number, phone and password constraints. The user factory supplies synthetic values and a password with uppercase/lowercase characters, numbers and a symbol. The registration page object uses the inspected `YYYY-MM-DD` date format and exact `data-test` names.

The registration test goes beyond checking a redirect: it signs in with the credentials it just registered and checks the account URL and displayed name.

Reason: a redirect by itself does not prove that a usable customer account exists.

### 3. Correct asynchronous billing setup

The initial purchase exploration tried to enter a billing address while the component was still loading the customer's address. Subsequent profile population overwrote the values, causing postcode-response timeouts. An initial hand-entered Kazakhstan address also produced an invoice validation error saying that the city did not belong to the selected country.

An intermediate change waited for some original field values but still allowed a later address initialization to overwrite edits. Inspection of the public client code confirmed that the address component initializes on load and again when the checkout step is entered.

The final fixture obtains a supported Netherlands address from `/postcode-lookup` and registers the test customer with that full address, including house number. The checkout page waits for every prefilled field to match this account address before proceeding. It does not race the component by editing the fields during initialization.

Reason: prepare valid prerequisites and wait for observable UI state. Do not hide a timing problem with a fixed delay or fake a successful invoice.

The demo's lookup can return synthetic values, so the implementation uses its returned address instead of assuming that a Netherlands postal code must yield a particular real-world city.

### 4. Assert a completed order

The payment flow has two separate actions: check payment, then confirm. The initial exploration incorrectly looked for a `data-test="order-confirmation"` attribute; the actual confirmation uses `id="order-confirmation"`.

The final implementation checks the payment message, waits for the invoice-creation response armed before confirmation, requires HTTP 201, and checks that the final UI contains that invoice number. The cart separately verifies item identity, quantity, unit price, line total and cart total.

Reason: a payment-success message or an add-to-cart click alone does not prove that checkout completed.

### 5. Separate password-reset validation paths

An unknown address displays `The selected email is invalid.` A malformed address is blocked by browser email validation. The latter does not reliably have a visible application error message, so the test polls the input's native `validity.typeMismatch` state and verifies that no server-result alert appears.

The valid and unknown-address cases additionally require the actual reset endpoint statuses, HTTP 200 and 422 respectively, rather than relying only on text.

Reason: unregistered and malformed emails fail at different layers and should have separate tests.

### 6. Disclose a reset-confirmation translation defect

Observed behavior: a successful reset request renders `page.forgot-password.confirm` in the English UI. The test explicitly characterizes this current confirmation, and Description.md and README.md disclose the defect. It does not silently accept arbitrary alert text or claim that the English message is correct.

This is a limitation of the current oracle. If the expected requirement is a readable English confirmation, that UI requirement is currently failing and should be reported as a defect. After the application fixes its translation, update the expected text following a new observation.

Reason: retain a precise check of the current workflow while making the known defect visible to the reviewer.

### 7. Protect test independence

All accounts used for login, purchase and successful reset are unique and created within the individual test fixture. The successful reset never uses the shared seeded customers. The public API documentation states that reset actually changes the password to a demo default, so using a shared customer would interfere with other tests and users.

No global saved authentication state or setup-test dependency is required for this small suite. Login is performed through the UI where it is part of the scenario, once for each customer context.

Reason: isolate customer mutations and allow tests to execute in parallel or separately.

### 8. Make comparison meaningful

The comparison has a stated oracle: Combination Pliers cost more than Pliers. It captures both names and prices from their live detail pages, checks positive prices and compares integer cents. The captured values are attached to the report.

Reason: comparing a price with itself or merely checking that two pages loaded would not meet the brief. Absolute prices and dynamic product IDs should not be hard-coded.

### 9. Stop waiting for unrelated full-page resources

After adding explicit HTTP assertions to reset tests, one repeated LOGIN-01 run timed out at `page.goto` while waiting for the full `load` event. Fifteen other executions passed. This diagnostic is retained in `evidence/navigation-diagnostic.json`.

Navigation now waits for `domcontentloaded`, followed by retrying checks for the form or product actually needed. The fix does not remove assertions or add retries. All business checks still have to pass.

Reason: a workflow should synchronize with its own ready state instead of requiring every page resource to finish loading.

### 10. Keep evidence authentic

Screenshots come from actual Playwright browser runs, and the result summary is extracted from Playwright's JSON reporter. No fake terminal screenshots or invented pass counts were produced. Full reports and traces remain local because traces can contain test authentication tokens.

The evidence collector was corrected to handle screenshot attachments embedded as base64 in the JSON reporter and to number repeated test entries per project. The collected output was checked, including the actual rendered HTML report screenshot and all eight scenario PNGs.

Reason: submitted evidence should be reproducible and should correspond to the source being submitted.

## Remaining limitations and student checks

- The student confirmed GPT-6.1 Sol with Low reasoning effort; that confirmation and the exact answer are recorded in Prompt.md.
- The public GitHub repository URL and Google Form submission complited myself.


## Sources consulted

- Supplied `Week_6_Masters_ST.pptx`, slides 20 and 26–30.
- The instructor's exact brief reproduced in Prompt.md.
- Live application: https://practicesoftwaretesting.com/
- Public API documentation: https://api.practicesoftwaretesting.com/api/documentation
- OpenAPI specification: https://api.practicesoftwaretesting.com/docs?api-docs.json
- Playwright fixtures: https://playwright.dev/docs/test-fixtures
- Playwright assertions: https://playwright.dev/docs/test-assertions
