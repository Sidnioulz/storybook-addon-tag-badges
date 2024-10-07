import type { Preview } from '@storybook/react'
import { themes } from '@storybook/theming'

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
      theme: themes.dark,
      toc: true,
    },
    tagBadges: {
      display: {
        sidebar: true,
        toolbar: true,
      },
      match: [
        {
          tags: 'foo',
          badge: {
            text: 'The foo',
          },
        },
      ],
    },
  },
  initialGlobals: {
    background: { value: 'dark' },
  },
}

export default preview
