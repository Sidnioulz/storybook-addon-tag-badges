import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],

  addons: [
    import.meta.resolve('./local-preset.ts'),
    '@storybook/addon-docs',
    '@storybook/addon-vitest',
    '@chromatic-com/storybook',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  managerHead: async (head) => {
    return `
      ${head}
      <meta name="google-site-verification" content="pEN4G_61OdhIR3Yl59I_M9QgF7FJsGNqWX1w-WcetC4" />
    `
  },
}

export default config
