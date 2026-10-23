# Screenshot evidence

These images are screenshots from actual Chromium/Playwright runs on 17 October 2026. They are not generated mockups.

| File | What it shows |
| --- | --- |
| `Playwright-report.png` | Real HTML report: 16 passed, 0 failed, 0 flaky, 0 skipped |
| `BUY-01.png` | Final order confirmation with a demo invoice number |
| `COMPARE-01.png` | Second product detail page after both products were captured and compared |
| `LOGIN-01.png` | Account page after successful login |
| `LOGIN-02.png` | Rejected credentials and login error |
| `REG-01.png` | Account page after registration and successful login with the newly created credentials |
| `RESET-01.png` | Current reset confirmation, including the known untranslated key |
| `RESET-02.png` | Unknown-email rejection |
| `RESET-03.png` | Malformed email remaining on the reset form; native validity is checked in the test |

The full report also includes captured product-comparison JSON and per-test steps. The PNGs show the final page state; they do not replace the assertions in the source or the recorded run summary. See `../evidence/Run-results.md` for run details.
