import { addons } from '@storybook/manager-api'

import { defaultConfig } from '../src/index'
import type { TagBadgeParameters } from '../src/types/TagBadgeParameters'

addons.setConfig({
  // tagBadges: defaultConfig satisfies TagBadgeParameters,
  tagBadges: [
    ...defaultConfig,
    {
      tags: 'new',
      badge: {
        text: 'New!',
        bgColor: '#00e256',
        borderColor: '#006b0b',
        fgColor: '#001c13',
        tooltip: 'This component is brand new!',
      },
      display: {
        sidebar: ['component'],
        toolbar: ['component', 'docs', 'story'],
      },
    },
  ] satisfies TagBadgeParameters,
})
