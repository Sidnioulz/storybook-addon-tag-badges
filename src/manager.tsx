import React from 'react'
import { addons, types } from 'storybook/manager-api'

import { Tool } from './components/Tool'
import { ADDON_ID, EVENTS, KEY, TOOL_ID } from './constants'
import { defaultConfig } from './defaultConfig'
import { renderLabel } from './renderLabel'
import { SET_CONFIG } from 'storybook/internal/core-events'
import { TagBadgeParameters } from './types/TagBadgeParameters'
import { API_SidebarOptions } from 'storybook/internal/types'
import { getBadgeProps } from './components/Badge'
import type { Badge } from './types/Badge'
import { matchTags } from './utils/tag'

declare global {
  interface Window {
    tagBadges: TagBadgeParameters
  }
}

function readConfig(config = addons.getConfig()): TagBadgeParameters {
  return config?.tagBadges
}

function readSidebarConfig(
  config = addons.getConfig(),
): API_SidebarOptions['renderLabel'] | undefined {
  return config?.sidebar?.renderLabel
}

addons.register(ADDON_ID, (api) => {
  // Config has functions and would get serialised if we sent it directly,
  // so instead we pass it to our child frame via window.
  api.on(EVENTS.REQUEST_CONFIG, () => {
    window.tagBadges = readConfig() ?? []
    api.emit(EVENTS.CONFIG_READY)
  })

  api.on(SET_CONFIG, (config) => {
    window.tagBadges = readConfig(config) ?? []
    api.emit(EVENTS.CONFIG_READY)
  })

  // Handle MDX badge render requests from preview
  api.on(EVENTS.REQUEST_MDX_BADGE_RENDER, (data: {
    tags: string[]
    context: 'mdx' | 'sidebar' | 'toolbar'
    type: 'component' | 'story'
    requestId: string
  }) => {
    const { tags, context, type, requestId } = data
    const parameters = readConfig() ?? defaultConfig
    
    // Compute serializable badge data
    const badgeData = (parameters || [])
      .flatMap((config) => {
        // Use the matchTags utility to find matching tags
        const matchedTags = matchTags(tags, config.tags)
        
        return matchedTags.map((tag) => {
          // Resolve badge config to serializable Badge object
          const badge = getBadgeProps(config.badge, undefined, tag, context)
          return { tag, badge }
        })
      })
    
    api.emit(EVENTS.MDX_BADGE_RENDER_RESPONSE, {
      requestId,
      badges: badgeData,
    })
  })

  // We now initialise the manager, both through window for preview and
  // through the addons singleton for manager.
  const userConfig = readConfig()
  window.tagBadges = userConfig ?? defaultConfig

  addons.setConfig({
    [KEY]: userConfig ?? defaultConfig,
    sidebar: { renderLabel: readSidebarConfig() ?? renderLabel },
  })

  // Register tools.
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: 'Tag Badges',
    render: () => <Tool api={api} />,
  })
})
