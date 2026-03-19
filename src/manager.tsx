import React from 'react'
import { addons, types } from 'storybook/manager-api'
import memoizerific from 'memoizerific'

import { Tool } from './components/Tool'
import { ADDON_ID, EVENTS, KEY, TOOL_ID } from './constants'
import { defaultConfig } from './defaultConfig'
import { renderLabel } from './renderLabel'
import { TagBadgeParameters } from './types/TagBadgeParameters'
import { getBadgeProps } from './components/Badge'
import { matchTags } from './utils/tag'
import { shouldDisplay, DisplayOutcome } from './utils/display'

function readConfig(config = addons.getConfig()): TagBadgeParameters {
  return config?.tagBadges ?? defaultConfig
}

// Memoise badge computation based on tags, context, type, and config.
const computeBadgeData = memoizerific(100)((
  tags: string[],
  context: 'mdx' | 'sidebar' | 'toolbar',
  type: string,
  config: TagBadgeParameters,
) => {
  return config
    .filter(
      (config) =>
        shouldDisplay({ config, context, type }) !== DisplayOutcome.NEVER,
    )
    .flatMap((config) => {
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
      type: string
      requestId: string
    }) => {
      const { tags, context, type, requestId } = data
      const config = readConfig()

      // Compute serialisable badge data using memoised function.
      const badgeData = computeBadgeData(tags, context, type, config)

      api.emit(EVENTS.MDX_BADGE_RENDER_RESPONSE, {
        requestId,
        badges: badgeData,
      })
    },
  )

  // Initialise manager whilst preserving user config.
  addons.setConfig({
    [KEY]: readConfig(),
    sidebar: { renderLabel, ...addons.getConfig()?.sidebar },
  })

  // Register tools.
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: 'Tag Badges',
    render: () => <Tool api={api} />,
  })
})
