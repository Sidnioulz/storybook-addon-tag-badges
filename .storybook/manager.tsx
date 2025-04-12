import React from 'react'
import { addons } from 'storybook/manager-api'
import { API_HashEntry } from '@storybook/types'

import { defaultConfig, renderLabel, Sidebar } from '../src/index'
import type { TagBadgeParameters } from '../src/types/TagBadgeParameters'

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
        style: {
          backgroundColor: '#001c13',
          color: '#e0eb0b',
        },
        tooltip: 'This component can catch flies!',
      },
      display: {
        sidebar: ['component', 'group'],
        toolbar: true,
      },
    },
    {
      tags: 'very-tight-space',
      badge: {
        text: 'Multi-word Badge, badgeofmanyletters',
        bgColor: '#1c0033',
        fgColor: '#e00b53',
      },
      display: {
        sidebar: true,
        toolbar: false,
      },
    },
  ] satisfies TagBadgeParameters,
})
