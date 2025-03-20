/// <reference types="vitest" />
import { defineConfig } from 'vite'
import { storybookTest } from '@storybook/experimental-addon-test/vitest-plugin'
import react from '@vitejs/plugin-react'

import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    react(),

    storybookTest({
      configDir: path.join(dirname, '.storybook'),
      storybookScript: 'pnpm start --ci',
    }),
  ],
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
      name: 'chromium',
      provider: 'playwright',
      headless: true,
    },
  },
})
