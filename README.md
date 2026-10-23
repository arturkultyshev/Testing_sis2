# SIS 2: Playwright automation for Toolshop

Five suites, eight independent tests against https://practicesoftwaretesting.com/.

Deadline: **23 October 2026**.

## Install and run

Use Node.js 22.18+ or 24 LTS and npm. An internet connection is required. No account credentials or `.env` file are required.

From the repository root:

```sh
npm install
npm test
```

The `postinstall` script downloads the matching Chromium browser automatically. To reinstall it explicitly, run `npm run install:browsers`.

For a reproducible dependency installation when `package-lock.json` is present, use `npm ci` instead of `npm install`. On Linux CI, use `npx playwright install --with-deps chromium` to install browser system dependencies too.

```sh
npm run typecheck
npm run test:headed
npm run test:ui
npm run test:serial
npm run test:parallel
npm run test:repeat
npm run report
```

To run one case or suite:

```sh
npm test -- tests/login.spec.ts
npm test -- --grep LOGIN-02
```

To record a trace on a local diagnostic run:

```sh
npm test -- --trace=on
```

The configuration normally records traces on the first retry. Local retries are disabled, so enable tracing explicitly when investigating a local failure. CI permits two retries; the first-attempt results should still be reviewed for flakiness.

## Coverage

| Suite | Cases | Main assertions |
| --- | --- | --- |
| Registration | REG-01 | Account creation, redirect, successful login with new credentials |
| Login | LOGIN-01, LOGIN-02 | Account access and signed-in identity; rejection and signed-out state |
| Purchase | BUY-01 | Correct item, quantity and totals; successful payment; confirmed invoice |
| Comparison | COMPARE-01 | Correct names and positive prices; Combination Pliers cost more than Pliers |
| Password reset | RESET-01, RESET-02, RESET-03 | Known-address confirmation; unknown-address error; malformed-address rejection |

Detailed steps, expected results, data and exclusions: [Description.md](Description.md).

## Structure and decisions

```text
tests/          Five spec files containing business scenarios
pages/          Page objects with locators, actions and retrying UI assertions
fixtures/       Page-object injection, isolated user setup and screenshot attachments
data/           Synthetic user factory, product names and money helpers
scripts/        Collection of real run evidence
screenshots/    Committed screenshots of completed scenarios and report
evidence/       Recorded run results
```

- **TypeScript:** matches the lecture and supports static checks with Playwright's built-in runner.
- **Page objects:** keep locator details out of specs. `BasePage` shares signed-in/signed-out assertions, while each screen owns its business actions. Assertion methods such as `expectItem` make test intent explicit without exposing selectors.
- **Fixtures:** inject page objects, create independent customers, and attach a final-page screenshot to every test result.
- **API setup:** prepares prerequisites without using the registration test as setup for other cases. The actual workflows under test run through the browser. The registered-user fixture uses the documented postcode endpoint to obtain an address supported by the demo.
- **Unique users:** UUIDs avoid collisions across reruns and workers. Reset never mutates the shared example accounts. Synthetic customers remain on the public demo because deleting customers requires administrator access.
- **Authentication:** the login case signs in through the UI; the purchase case signs in once for its own customer. This small suite deliberately uses isolated per-test identities rather than a global saved session. No test depends on an authentication setup test.
- **Locators:** `testIdAttribute: 'data-test'`, accessible roles, and the stable `#order-confirmation` ID. No CSS classes or positional XPath. Search selects exact product names, not positions.
- **Synchronization:** auto-waiting, retrying assertions, and response waits armed before submitting registration/orders. No arbitrary time delays.
- **Currency:** compare integer cents and compute totals from the captured live price.
- **Parallel execution:** `fullyParallel: true`, three local workers, two on CI, independent browser storage and customer records.

## Evidence and AI disclosure

```sh
npm test -- --repeat-each=2 --workers=3 --trace=on
npm run evidence
```

`npm run evidence` copies actual screenshot attachments into `screenshots/` and produces [evidence/Run-results.md](evidence/Run-results.md) and a JSON summary. It fails if the recorded run contains unsuccessful tests. Running it replaces the saved evidence with the latest run.

The retained validation has 16/16 successful parallel executions and 8/8 successful sequential tests after installation in a clean project copy. See [the clean-install record](evidence/clean-install-check.json). The clean-copy check reused the machine's npm cache and installed Chromium; it was not a test on a fresh operating system.

The full interactive report is generated locally in `playwright-report/`. Use `npm run report` to inspect test steps, screenshots and trace attachments. Reports, traces, saved authentication and dependencies are excluded from Git. Traces may contain test authentication tokens even when all customer data is synthetic.

[Prompt.md](Prompt.md) contains the human prompts and AI tool disclosure. [Review.md](Review.md) describes observed failures, review and corrections. These documents are AI-assisted records; the student must personally review the code and results before presenting them as their own reviewed submission.

## Known application behavior

The inspected deployment displays the untranslated key `page.forgot-password.confirm` after a successful reset request. RESET-01 explicitly checks that current behavior and documents the UI defect. It does not check email delivery or claim that the English copy is correct.

The public demo can change its catalogue, validation rules or markup. Treat a failure as evidence to investigate. Do not replace assertions with generic visibility checks to make the suite green.

`BASE_URL` and `API_URL` can target a compatible deployment. Set both when changing environments. A pass on the default site does not guarantee that another build has identical behavior.

## Publish and submit

The local project is ready to be uploaded as a **public** GitHub repository after you review it. Include code, the lockfile, the three required Markdown files, screenshots and evidence. Exclude everything listed in `.gitignore`.

After creating an empty public repository on GitHub, use the actual repository URL in these commands:

```sh
git init -b main
git add .
git commit -m "Add SIS 2 Playwright automation and evidence"
git remote add origin YOUR_REPOSITORY_URL
git push -u origin main
```

Verify the public link opens without authentication and that installation/run instructions work from a fresh clone. Submit the link through the [course Google Form](https://docs.google.com/forms/d/e/1FAIpQLSeG3uxaPlfoz9ECk9a46oP2qo4d-mm9g5LjeTKrUIpSRMDnxw/viewform?usp=publish-editor).

The repository URL and course submission are not created by these instructions themselves.
