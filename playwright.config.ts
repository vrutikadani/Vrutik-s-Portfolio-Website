import { defineConfig, devices } from '@playwright/test';

// Uses the system Chrome when CHROME_PATH is set (CI images often have one),
// otherwise Playwright's own Chromium.
const executablePath = process.env.CHROME_PATH || undefined;

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 30_000,
  fullyParallel: true,
  reporter: [['list']],
  use: { baseURL: 'http://localhost:4321', launchOptions: { executablePath } },
  webServer: { command: 'npx astro preview --port 4321 --ignore-lock', url: 'http://localhost:4321', reuseExistingServer: true },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], launchOptions: { executablePath } } },
    { name: 'mobile', use: { ...devices['Pixel 7'], launchOptions: { executablePath } } },
  ],
});
