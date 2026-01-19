import type { Preview } from '@storybook/react-vite'
import { themes } from 'storybook/theming'

import ThemeProvider from './ThemeProvider'

export const decorators = [ThemeProvider]

const preview: Preview = {
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
}

export default preview
