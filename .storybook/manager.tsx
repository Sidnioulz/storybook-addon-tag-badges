import React from 'react'
import { addons } from 'storybook/manager-api'
import { API_HashEntry } from 'storybook/internal/types'

import tagBadges from './tagBadges'
import { renderAriaLabel, renderLabel, Sidebar } from '../src/manager-helpers'

addons.setConfig({
  sidebar: {
    showRoots: true,
    collapsedRoots: ['addon', 'example'],
    renderLabel: (item: API_HashEntry, api, context) => {
      if (item.name.startsWith('Addon')) {
        return <Sidebar item={item}>🌟 Addon</Sidebar>
      }

      return renderLabel(item, api, context)
    },
    renderAriaLabel: (item, api, context) => {
      if (item.name.startsWith('Addon')) {
        return 'Addon'
      }

      return renderAriaLabel(item, api, context)
    },
    filters: {
      patterns: (item) => {
        return !item.tags?.includes('chromatic-only')
      },
    },
  },
  tagBadges,
  tagBadgesOptions: { compactSidebar: true },
})
