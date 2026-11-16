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

Verify the public link opens without authentication and that installation/run instructions work from a fresh clone. 

## CI

[![Playwright Tests](https://github.com/arturkultyshev/Testing_sis2/actions/workflows/playwright.yml/badge.svg?branch=main)](https://github.com/arturkultyshev/Testing_sis2/actions/workflows/playwright.yml)

**CI system:** GitHub Actions, because this repository already lives on GitHub and Actions supports parallel matrix jobs, npm caching and downloadable reports without maintaining a server.

The pipeline in `.github/workflows/playwright.yml` runs on every push and pull request, without branch filters. It uses Node.js 22, `setup-node` with `cache: npm`, `npm ci`, and `npx playwright install --with-deps chromium`. The complete suite runs across four parallel shards without test or project filters. `fail-fast: false` lets other shards finish if one fails. A dependent job merges blob reports into one HTML report and JUnit XML even after a test failure, unless the run is cancelled.

With `CI=true`, the configuration enables `forbidOnly`, two retries, two workers, and the list, blob and JUnit reporters. Traces are recorded on the first retry, screenshots on failure, and failed-test videos are retained. Fully passing tests normally have no trace.

**Artifacts:** `playwright-report` contains the merged HTML report; `test-results-1` through `test-results-4` contain per-shard results and JUnit; `junit-report` contains the merged XML. These are retained for **14 days**. Intermediate `blob-report-N` artifacts last one day. Repository retention settings must allow at least 7 days. Download and extract the HTML artifact and open it with `npx playwright show-report <folder>`; open a downloaded trace with `npx playwright show-trace <trace.zip>`.

The default demo needs no secrets or variables. For another compatible environment, set both `BASE_URL` and `API_URL` in Settings → Secrets and variables → Actions → Variables. Do not put credentials in this workflow.

### Runtime

| Configuration | Total run time | Run tests step (slowest shard) | Run |
| --- | --- | --- | --- |
| 1 shard + merge | Not measured on GitHub yet | Not measured | Pending |
| 4 shards + merge | Not measured on GitHub yet | Not measured | Pending |

Use Actions → Playwright Tests → Run workflow, choosing `shards: 1` for the baseline and `shards: 4` for the parallel variant. This keeps the test suite, workers, setup and merge job identical. Manual dispatch becomes available after the workflow is present on the default branch. Run each variant three times, record the median total duration and the median slowest test-step duration, and replace the pending cells with real values and links. No performance improvement is claimed before those measurements; with eight short tests, installation and merging may dominate.

### Local CI check

```sh
npm ci
npx playwright install --with-deps chromium
npm run typecheck
CI=true npx playwright test
```

To check all four shards and merging locally (bash/zsh), start with an empty `all-blob-reports` directory:

```sh
mkdir -p all-blob-reports
for shard in 1 2 3 4; do
  CI=true npx playwright test --shard="$shard/4" || exit 1
  cp blob-report/*.zip all-blob-reports/
done
npx playwright merge-reports --config merge.config.ts ./all-blob-reports
npx playwright show-report
```

These local shards run sequentially to validate report merging, not to measure CI speed. Docker and `act` are optional additional checks; the final evidence must come from GitHub Actions.

### Submission evidence still required

1. Push the workflow on a feature branch and open a PR into `main`; retain separate push and PR run links.
2. Confirm the second run restores the npm cache in the setup-node log.
3. Confirm the run graph has four shards and the merge job; download the HTML and per-shard artifacts.
4. Temporarily use `test.only` on a diagnostic branch and confirm CI rejects it, then revert the change. Keep that failed run link.
5. Open a real retry trace when available; a successful first attempt creates none. If needed, demonstrate tracing with an explicitly documented temporary failing diagnostic test and then remove it.
6. Fill the runtime table using real Actions runs and write a conclusion based on the measurements.
7. Merge the passing PR and confirm the badge displays the `main` result.

CI assistance and exact follow-up prompts are recorded in [CI-AI.md](CI-AI.md).
