import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const root = path.resolve(import.meta.dirname, '..');
const input = path.join(root, 'test-results/results.json');
if (!fs.existsSync(input)) throw new Error('Run npm test before collecting evidence.');
const report = JSON.parse(fs.readFileSync(input, 'utf8'));
const evidenceDir = path.join(root, 'evidence');
const screenshotsDir = path.join(root, 'screenshots');
fs.mkdirSync(evidenceDir, { recursive: true });
fs.mkdirSync(screenshotsDir, { recursive: true });

const tests = [];
const repeatsByCase = new Map();
function visit(suite) {
  for (const spec of suite.specs ?? []) {
    for (const test of spec.tests ?? []) {
      const caseKey = `${spec.file}::${spec.title}::${test.projectName}`;
      const repeatIndex = repeatsByCase.get(caseKey) ?? 0;
      repeatsByCase.set(caseKey, repeatIndex + 1);
      const result = test.results.at(-1);
      const id = spec.title.split(':')[0];
      const screenshot = result.attachments?.find(a => a.name === 'final-page' && (a.path || a.body));
      let screenshotPath;
      if (screenshot && repeatIndex === 0) {
        screenshotPath = `screenshots/${id}.png`;
        if (screenshot.path) fs.copyFileSync(screenshot.path, path.join(root, screenshotPath));
        else fs.writeFileSync(path.join(root, screenshotPath), Buffer.from(screenshot.body, 'base64'));
      }
      tests.push({
        id, title: spec.title, file: path.relative(root, path.resolve(report.config.rootDir, spec.file)),
        project: test.projectName, repeatIndex,
        status: result.status, outcome: test.status, durationMs: result.duration,
        attempts: test.results.length, screenshot: screenshotPath,
      });
    }
  }
  for (const child of suite.suites ?? []) visit(child);
}
for (const suite of report.suites) visit(suite);
const summary = {
  generatedFrom: 'Playwright JSON reporter, test-results/results.json',
  runStartedAt: report.stats.startTime,
  runStartedAtAlmaty: new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'long', timeStyle: 'long', timeZone: 'Asia/Almaty',
  }).format(new Date(report.stats.startTime)),
  durationMs: report.stats.duration,
  nodeVersion: process.version,
  playwrightVersion: require('@playwright/test/package.json').version,
  workers: report.config.workers,
  stats: report.stats,
  tests,
};
fs.writeFileSync(path.join(evidenceDir, 'run-summary.json'), JSON.stringify(summary, null, 2) + '\n');
const lines = [
  '# Recorded test run', '',
  `Started: ${summary.runStartedAtAlmaty} (Asia/Almaty).`, '',
  `Playwright ${summary.playwrightVersion}; Node ${summary.nodeVersion}; ${summary.workers} workers.`, '',
  `Passed: ${tests.filter(t => t.status === 'passed').length}; failed: ${tests.filter(t => t.status === 'failed').length}; skipped: ${tests.filter(t => t.status === 'skipped').length}.`, '',
  '| Test | Repeat | Result | Duration | Attempts |',
  '| --- | --- | --- | --- | --- |',
  ...tests.map(t => `| ${t.id} | ${t.repeatIndex + 1} | ${t.status} | ${(t.durationMs / 1000).toFixed(2)} s | ${t.attempts} |`), '',
  'These results describe the recorded run only. Re-run against the public application before submission.', '',
  'Screenshots are copied from real Playwright attachments. The HTML report and traces stay local because traces can contain test authentication tokens.',
];
fs.writeFileSync(path.join(evidenceDir, 'Run-results.md'), lines.join('\n') + '\n');
console.log(`Collected ${tests.length} test results and screenshots in evidence/ and screenshots/.`);
if (tests.some(t => t.status !== 'passed') || report.errors?.length) process.exitCode = 1;
