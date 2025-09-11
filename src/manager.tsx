import React from 'react'
import { addons, types } from 'storybook/manager-api'

import { Tool } from './components/Tool'
import { ADDON_ID, KEY, TOOL_ID } from './constants'
import { defaultConfig } from './defaultConfig'
import { renderLabel } from './renderLabel'

addons.register(ADDON_ID, (api) => {
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: 'Tag Badges',
    render: () => <Tool api={api} />,
  })
})

addons.setConfig({
  [KEY]: defaultConfig,
  sidebar: { renderLabel },
})
