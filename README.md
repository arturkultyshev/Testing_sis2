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
| 1 shard + merge (failed) | 3 min 23 s | 2 min 1 s | [run](https://github.com/arturkultyshev/Testing_sis2/actions/runs/43883553681) |
| 4 shards + merge (failed) | 2 min 45 s | 1 min 3 s | [run](https://github.com/arturkultyshev/Testing_sis2/actions/runs/43882905840) |

**Conclusion:** these are single failed diagnostic runs affected by Cloudflare challenges and retries, so their durations do not establish a performance improvement. A valid comparison of passing runs remains required. Total duration is calculated from run_started_at to the completed run’s updated_at in GitHub metadata.

As required by the guide, measure the baseline with matrix `shardIndex: [1]` and `shardTotal: [1]`, then restore `[1, 2, 3, 4]` and `[4]` for the final workflow. Both measurements must come from GitHub Actions. Repeat each variant 2–3 times and take the median when the environment is stable. Record total duration and the Run Playwright tests step duration (slowest shard).

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

### Submission checklist

- [x] Separate feature-branch push and PR runs exist (links below).
- [x] The second completed PR run restores npm cache: setup-node reports `Cache restored successfully` in [shard 4](https://github.com/arturkultyshev/Testing_sis2/actions/runs/43882915937/job/133353418487).
- [x] Browser installation and unfiltered suite execution appear in the hosted logs.
- [x] Four hosted shards and a successful Merge reports job are present; HTML, per-shard results and JUnit artifacts exist with 14-day retention.
- [x] CI enables forbidOnly, retries and JUnit; a temporary local test.only was rejected, then removed.
- [x] Real first-retry trace ZIP exists in the failed hosted run's downloaded test-results-1 artifact. Interactive trace viewing still needs verification.
- [ ] A passing hosted full-suite run.
- [ ] Valid before/after performance conclusion from successful GitHub runs.
- [ ] Merge the passing PR and verify the main badge.

CI assistance and exact follow-up prompts are recorded in [CI-AI.md](CI-AI.md).

### Hosted validation on 16 November 2026

- [Pull request #1](https://github.com/arturkultyshev/Testing_sis2/pull/1).
- [Feature-branch push run](https://github.com/arturkultyshev/Testing_sis2/actions/runs/43882263092): four shards executed, npm and Chromium installation succeeded, report merging succeeded, and all ten artifacts were uploaded. GitHub's artifact metadata confirms approximately 14 days for HTML, JUnit and per-shard results.
- [Separate pull-request run](https://github.com/arturkultyshev/Testing_sis2/actions/runs/43882915937).

**Current blocker:** on the hosted push run, the public demo served a Cloudflare “Performing security verification” page in place of the catalogue. BUY-01 timed out waiting for `search-query`; the downloaded error context confirms that security page. Other shards also reported test failures. The same eight tests passed locally. This is an environment access problem; assertions have not been weakened and the bot protection has not been bypassed. The hosted run is not a passing submission.

The implementation follows the guide’s GitHub-hosted `ubuntu-latest` workflow. A passing hosted run, runtime comparison and the main badge remain incomplete while the target site blocks access. No self-hosted runner or alternate target is configured. Retry traces are present in `test-results-1` from the failed push run, providing real failure evidence.
