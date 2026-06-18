import { defineConfig, devices } from '@playwright/test';

// ---------------------------------------------------------------------------
// Playwright configuration for TrainingKit E2E tests.
//
// The app talks to a live remote Supabase backend so we use generous timeouts.
// The webServer block auto-starts `npm run dev` and reuses an existing server
// when running locally (reuseExistingServer: !process.env.CI).
// ---------------------------------------------------------------------------

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false, // Supabase rate-limits; run tests sequentially
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: 'http://localhost:5174',
    // Remote Supabase → allow up to 15 s for network actions
    actionTimeout: 15_000,
    navigationTimeout: 20_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5174',
    // Reuse the server if it is already running locally; always spin up in CI.
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
