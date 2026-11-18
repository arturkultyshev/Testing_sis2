import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : 3,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  reporter: isCI ? [
    ['list'],
    ['blob'],
    ['junit', { outputFile: 'reports/junit.xml' }],
  ] : [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://practicesoftwaretesting.com',
    testIdAttribute: 'data-test',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1440, height: 1000 },
    locale: 'en-US',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
