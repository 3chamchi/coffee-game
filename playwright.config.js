const { defineConfig, devices } = require('@playwright/test');

// 정적 단일 HTML PWA — 별도 서버 없이 file:// 로 직접 로드한다.
module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: 'list',
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
