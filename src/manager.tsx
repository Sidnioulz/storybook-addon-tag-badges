import React from 'react'
import { addons, types } from '@storybook/manager-api'

import { Tool } from './components/Tool'
import { ADDON_ID, EVENTS, KEY, TOOL_ID } from './constants'
import { defaultConfig } from './defaultConfig'
import { renderLabel } from './renderLabel'
import { SET_CONFIG } from 'storybook/internal/core-events'
import { TagBadgeParameters } from './types/TagBadgeParameters'

declare global {
  interface Window {
    tagBadges: TagBadgeParameters
  }
}

function readConfig(config = addons.getConfig()): TagBadgeParameters {
  return config?.tagBadges
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

  // We now initialise the manager, both through window for preview and
  // through the addons singleton for manager.
  const userConfig = readConfig()
  window.tagBadges = userConfig ?? defaultConfig

  addons.setConfig({
    [KEY]: userConfig ?? defaultConfig,
    sidebar: { renderLabel },
  })

  // Register tools.
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: 'Tag Badges',
    render: () => <Tool api={api} />,
  })
})
