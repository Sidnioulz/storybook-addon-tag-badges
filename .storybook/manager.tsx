import React from 'react'
import { addons } from '@storybook/manager-api'

import { defaultConfig, renderLabel, Sidebar } from '../src/index'
import type { TagBadgeParameters } from '../src/types/TagBadgeParameters'
import { API_HashEntry } from '@storybook/types'

addons.setConfig({
  sidebar: {
    renderLabel: (item: API_HashEntry) => {
      if (item.name.startsWith('Addon')) {
        return <Sidebar item={item}>🌟 Addon</Sidebar>
      }

      return renderLabel(item)
    },
    filters: {
      patterns: (item) => {
        return !item.tags?.includes('chromatic-only')
      },
    },
  },
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
        sidebar: ['component', 'group'],
        toolbar: true,
      },
    },
  ] satisfies TagBadgeParameters,
})
