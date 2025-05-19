import { defineWorkspace } from 'vitest/config'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'

export default defineWorkspace([
  {
    extends: './vite.config.ts',
    test: {
      include: ['**/__tests__/**/*.spec.{js,ts,jsx,tsx}'],
    },
  },
  {
    extends: './vite.config.ts',
    plugins: [storybookTest({ storybookScript: 'pnpm storybook --ci' })],
    test: {
      name: 'storybook',
      browser: {
        enabled: true,
        headless: true,
        provider: 'playwright',
        instances: [
          {
            browser: 'chromium',
          },
        ],
      },
      setupFiles: ['./.storybook/vitest.setup.ts'],
    },
  },
])
