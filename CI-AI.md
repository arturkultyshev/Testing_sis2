# AI assistance for the Playwright CI assignment

Date: 16 November 2026, Asia/Almaty.

Tool: OpenAI Codex desktop app. The current session identifies the assistant as GPT-6 based; the exact model variant and reasoning setting are not exposed to the assistant and have not been verified. The model statement in Prompt.md describes the earlier October session, not this follow-up. The student should add the current model and effort displayed in the app before submission.

## Supplied material and exact request

Reference: `SIS 2_ CI pipeline for Playwright  step-by-step guide.docx`. The document was read as assignment material. The initial attachment message had an empty request.

The student's subsequent request, verbatim:

```text
что мне надо сделать и давай сделаем 
```

## Assistance and decisions

The assistant read the assignment, inspected the existing repository and retained its eight business tests and page objects. It added GitHub Actions with four shards, npm caching, Chromium installation, blob report merging and 14-day HTML/JUnit/test-result retention. It made reporters conditional on CI, added retained failure video, a typed merge config, ignored generated outputs, and added CI instructions and a real repository badge URL to README.md.

A manual one-or-four-shard input allows timing comparison without repeatedly editing the workflow. Push and PR events always use four shards. The existing BASE_URL and API_URL defaults remain usable when repository variables are absent. Timing data and GitHub evidence are explicitly pending rather than invented.

Validation outcomes are recorded separately after the actual commands complete. The student must review the implementation and actual GitHub runs before submission.

## Actual local verification

- `npm run typecheck`: passed.
- Initial sandboxed browser launch: blocked by macOS process permissions before tests could run. Repeated with authorized browser execution.
- `CI=true npx playwright test`: 8 passed, 13.9 seconds, with two workers and no retries needed.
- All four local shards: 2 passed each (9.2, 4.9, 4.9 and 1.6 seconds respectively), run sequentially only to validate distribution and merging.
- Merge of four real blob ZIPs: completed; HTML and merged JUnit generated.
- Temporary `test.only` diagnostic: CI test discovery rejected it through `forbidOnly`; temporary file removed immediately.
- `git diff --check`: passed.

Local durations are not GitHub Actions runtime evidence. Docker/act, GitHub cache restoration, hosted artifact retention, push/PR runs and main badge status are not established by these local checks.

## Hosted execution and review

Published branch: `ci/playwright-pipeline`. Opened PR #1 against main. Preserved the README edit already present in remote main when resolving the rebase conflict. The default branch has not been merged.

Push run: https://github.com/arturkultyshev/Testing_sis2/actions/runs/43882263092

PR run: https://github.com/arturkultyshev/Testing_sis2/actions/runs/43882604356

The push run installed dependencies and Chromium successfully and ran four shards. Three shards failed business tests. Merge reports succeeded despite those failures, and all ten artifacts were uploaded. API metadata verifies approximately 14-day expiry for final reports/results. Downloaded the real `test-results-1` artifact: its error context shows Cloudflare's “Performing security verification” page rather than the product catalogue. Retry trace ZIPs are present. No Cloudflare bypass or weakening of test assertions was attempted. Passing hosted runs, main badge, baseline timings and cache evidence are still pending. Asked the student to choose between a separately configured self-hosted runner, another compatible authorized deployment, or retaining the documented blocker.
