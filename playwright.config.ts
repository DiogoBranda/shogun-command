import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/ui",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
    video: "retain-on-failure",
    screenshot: "only-on-failure"
  },
  webServer: {
    command: "npm run dev -- --hostname 127.0.0.1 --port 3000",
    url: "http://127.0.0.1:3000/login",
    reuseExistingServer: !process.env.CI,
    env: {
      E2E_TEST_AUTH: "true",
      E2E_UI_FIXTURES: "true",
      AUTH_SECRET: "e2e-test-auth-secret-with-enough-entropy",
      AUTH_ALLOWED_EMAILS: "e2e@shogun.local",
      AUTH_GOOGLE_ID: "e2e-google-client-id",
      AUTH_GOOGLE_SECRET: "e2e-google-client-secret"
    }
  },
  projects: [
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/
    },
    {
      name: "desktop",
      dependencies: ["setup"],
      testIgnore: /auth\.setup\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1852, height: 1031 },
        storageState: "tests/ui/.auth/user.json"
      }
    },
    {
      name: "mobile",
      dependencies: ["setup"],
      testIgnore: /auth\.setup\.ts/,
      use: {
        ...devices["Pixel 7"],
        storageState: "tests/ui/.auth/user.json"
      }
    }
  ]
});
