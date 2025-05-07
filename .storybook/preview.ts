import type { Preview } from '@storybook/react-vite'
import { themes } from 'storybook/theming'

import tagBadges from './tagBadges'
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
      source: {
        codePanel: true,
      },
      theme: themes.dark,
      toc: true,
    },
  },
  initialGlobals: {
    background: { value: 'dark' },
  },
}

declare global {
  interface Window {
    tagBadges: typeof tagBadges
  }
}

window.tagBadges = tagBadges

export default preview
