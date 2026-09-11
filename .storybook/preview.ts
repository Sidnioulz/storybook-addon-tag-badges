import addonA11y from '@storybook/addon-a11y'
import addonDocs from '@storybook/addon-docs'
import { definePreview } from '@storybook/react-vite'
import { themes } from 'storybook/theming'

import tagBadges from '../src/index.js'
import ThemeProvider from './ThemeProvider'

export default definePreview({
  addons: [addonDocs(), addonA11y(), tagBadges()],

  decorators: [ThemeProvider],

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

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
  initialGlobals: {
    background: { value: 'dark' },
  },
})
