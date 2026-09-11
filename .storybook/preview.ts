import { definePreview } from '@storybook/react-vite'
import addonA11y from '@storybook/addon-a11y'
import addonDocs from '@storybook/addon-docs'
import { themes } from 'storybook/theming'

import ThemeProvider from './ThemeProvider'
// Load the built addon in this local Storybook, the way end users register it.
import tagBadges from '../dist/index.js'

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
