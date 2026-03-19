import React from 'react'
import { addons } from 'storybook/manager-api'
import { API_HashEntry } from 'storybook/internal/types'

import tagBadges from './tagBadges'
import { renderLabel, Sidebar } from '../src/manager-helpers'

addons.setConfig({
  sidebar: {
    showRoots: true,
    collapsedRoots: ['addon', 'example'],
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
  tagBadges,
})
