import { addons } from '@storybook/manager-api'

import { defaultConfig } from '../src/index'
import type { TagBadgeParameters } from '../src/types/TagBadgeParameters'

addons.setConfig({
  tagBadges: [
    ...defaultConfig,
    {
      tags: 'frog',
      badge: {
        text: 'Frog 🐸',
        bgColor: '#001c13',
        fgColor: '#e0eb0b',
        tooltip: 'This component can catch flies!',
      },
      display: {
        sidebar: ['component'],
        toolbar: false,
      },
    },
  ] satisfies TagBadgeParameters,
})
