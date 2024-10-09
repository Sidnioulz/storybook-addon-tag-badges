import React from 'react'
import { addons, types } from '@storybook/manager-api'

import { ADDON_ID, TAB_ID, TOOL_ID } from 'src/constants'
import { Sidebar } from './components/Sidebar'
import { Tool } from './components/Tool'

addons.register(ADDON_ID, (api) => {
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: 'Tag Badges',
    match: ({ viewMode, tabId }) =>
      !!((viewMode && viewMode.match(/^(story)$/)) || tabId === TAB_ID),
    render: () => <Tool api={api} />,
  })
})

addons.setConfig({
  sidebar: {
    renderLabel: (item) => {
      if (
        item.type !== 'story' &&
        item.type !== 'docs' &&
        item.type !== 'component' &&
        item.type !== 'group'
      ) {
        return
      }

      return <Sidebar item={item} />
    },
  },
})
