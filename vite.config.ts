/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'

export default defineConfig({
  plugins: [react(), storybookTest({ storybookScript: 'pnpm storybook --ci' })],
  test: {
    coverage: {
      include: [
        'src/**/*.{mjs,mjsx,js,jsx,ts,tsx}',
        '!src/stories/**',
        '!src/examples/**',
        '!src/**/*.stories.{ts,tsx}',
      ],
      provider: 'istanbul',
    },
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts', './.storybook/vitest.setup.ts'],
    browser: {
      enabled: true,
      provider: 'playwright',
      headless: true,
      instances: [
        {
          browser: 'chromium',
        },
      ],
    },
  },
})
