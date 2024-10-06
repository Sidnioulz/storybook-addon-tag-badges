import React from 'react'
import { addons, types } from 'storybook/internal/manager-api'

import { Tool } from './components/Tool'
import { ADDON_ID, TAB_ID, TOOL_ID } from './constants'

addons.register(ADDON_ID, (api) => {
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: 'My addon',
    match: ({ viewMode, tabId }) =>
      !!((viewMode && viewMode.match(/^(story)$/)) || tabId === TAB_ID),
    render: () => <Tool api={api} />,
  })
})
