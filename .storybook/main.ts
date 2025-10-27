import { defineMain } from '@storybook/react-vite/node'

export default defineMain({
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    // Put this back after finishing .test support on the canary FIXME.
    // import.meta.resolve('./local-preset.ts'),
    '@storybook/addon-docs',
    '@storybook/addon-vitest',
  ],
  framework: '@storybook/react-vite',
})
