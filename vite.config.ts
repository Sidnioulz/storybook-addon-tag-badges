/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    coverage: {
      include: [
        'src/**/*.{mjs,mjsx,js,jsx,ts,tsx}',
        '!src/stories/**',
        '!src/**/*.stories.ts',
      ],
      provider: 'istanbul',
    },
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
  },
})
