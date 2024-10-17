import React from 'react'
import { addons, types } from '@storybook/manager-api'

import { Sidebar } from './components/Sidebar'
import { Tool } from './components/Tool'
import { ADDON_ID, KEY, TOOL_ID } from './constants'
import { defaultConfig } from './defaultConfig'

addons.register(ADDON_ID, (api) => {
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: 'Tag Badges',
    render: () => <Tool api={api} />,
  })
})

addons.setConfig({
  [KEY]: defaultConfig,
  sidebar: {
    renderLabel: (item) => {
      if (
        item.type !== 'story' &&
        item.type !== 'docs' &&
        item.type !== 'component'
      ) {
        return
      }

      return <Sidebar item={item} />
    },
  },
})
