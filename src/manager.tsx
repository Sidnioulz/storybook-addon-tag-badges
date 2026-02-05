import React from 'react'
import { addons, types } from 'storybook/manager-api'
import memoizerific from 'memoizerific'

import { Tool } from './components/Tool'
import { ADDON_ID, EVENTS, KEY, TOOL_ID } from './constants'
import { defaultConfig } from './defaultConfig'
import { renderLabel } from './renderLabel'
import { TagBadgeParameters } from './types/TagBadgeParameters'
import { API_SidebarOptions } from 'storybook/internal/types'
import { getBadgeProps } from './components/Badge'
import { matchTags } from './utils/tag'

function readConfig(config = addons.getConfig()): TagBadgeParameters {
  return config?.tagBadges ?? defaultConfig
}

function readSidebarConfig(
  config = addons.getConfig(),
): API_SidebarOptions['renderLabel'] | undefined {
  return config?.sidebar?.renderLabel
}

// Memoise badge computation based on tags, context, and config.
const computeBadgeData = memoizerific(100)((
  tags: string[],
  context: 'mdx' | 'sidebar' | 'toolbar',
  config: TagBadgeParameters,
) => {
  return config.flatMap((config) => {
    const matchedTags = matchTags(tags, config.tags)
    return matchedTags.map((tag) => {
      const badge = getBadgeProps(config.badge, undefined, tag, context)
      return { tag, badge }
    })
  })
})

addons.register(ADDON_ID, (api) => {
  // Handle MDX badge render requests from preview.
  api.on(
    EVENTS.REQUEST_MDX_BADGE_RENDER,
    (data: {
      tags: string[]
      context: 'mdx' | 'sidebar' | 'toolbar'
      requestId: string
    }) => {
      const { tags, context, requestId } = data
      const config = readConfig()

      // Compute serialisable badge data using memoised function.
      const badgeData = computeBadgeData(tags, context, config)

      api.emit(EVENTS.MDX_BADGE_RENDER_RESPONSE, {
        requestId,
        badges: badgeData,
      })
    },
  )

  // Initialise manager whilst preserving user config.
  addons.setConfig({
    [KEY]: readConfig(),
    sidebar: { renderLabel: readSidebarConfig() ?? renderLabel },
  })

  // Register tools.
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: 'Tag Badges',
    render: () => <Tool api={api} />,
  })
})
