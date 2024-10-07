import React from 'react'
import { addons, types } from '@storybook/manager-api'

import { Tool } from 'src/components/Tool'
import { ADDON_ID, TAB_ID, TOOL_ID } from 'src/constants'

addons.register(ADDON_ID, (api) => {
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: 'Tag Badges',
    match: ({ viewMode, tabId }) =>
      !!((viewMode && viewMode.match(/^(story)$/)) || tabId === TAB_ID),
    render: () => <Tool api={api} />,
  })
})
