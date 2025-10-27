import { definePreview } from 'storybook/internal/csf'
import { themes } from 'storybook/theming'
import addonDocs from '@storybook/addon-docs'
import addonVitest from '@storybook/addon-vitest'

import ThemeProvider from './ThemeProvider'

export const decorators = [ThemeProvider]

const preview = definePreview({
  addons: [
    // Put this back after finishing .test support on the canary FIXME.
    // import.meta.resolve('../src/index.ts'),
    addonDocs(),
    addonVitest(),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      codePanel: true,
      theme: themes.dark,
      toc: true,
    },
  },
  initialGlobals: {
    background: { value: 'dark' },
  },
})

export default preview
