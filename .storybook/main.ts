import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],

  addons: [
    import.meta.resolve('./local-preset.ts'),
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    {
      name: '@rocksoliddigital/storybook-addon-lineage',
      options: {
        exclude: ['__tests__', '__fixtures__'],
        layers: [
          {
            id: 'component',
            label: 'Components',
            match: /^src\/components\//,
            color: '#2563eb',
          },
          {
            id: 'example',
            label: 'Examples',
            match: /^src\/examples\//,
            color: '#7c3aed',
          },
          {
            id: 'story',
            label: 'Stories',
            match: /^src\/stories\//,
            color: '#be123c',
          },
          {
            id: 'utility',
            label: 'Utilities & types',
            match: /^src\/(utils|types)\//,
            color: '#475569',
            hidden: true,
          },
          {
            id: 'addon',
            label: 'Addon entry points',
            match: /^src\/[^/]+$/,
            color: '#047857',
          },
        ],
      },
    },
    '@storybook/addon-mcp',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  features: {
    experimentalReview: true,
  },
  managerHead: async (head) => {
    return `
      ${head}
      <meta name="google-site-verification" content="pEN4G_61OdhIR3Yl59I_M9QgF7FJsGNqWX1w-WcetC4" />
    `
  },
}

export default config
