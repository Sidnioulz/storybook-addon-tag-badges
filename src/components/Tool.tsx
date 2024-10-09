import React, { useMemo } from 'react'
import { type API } from '@storybook/manager-api'

import { KEY, TOOL_ID } from 'src/constants'
import type { Parameters } from 'src/schemas/parameters'

export const Tool = function MyAddonSelector({ api }: { api: API }) {
  const badges = api.getCurrentParameter<string[]>('badges') ?? []
  const parameters = api.getCurrentParameter<Parameters>(KEY) ?? {}
  const storyData = api.getCurrentStoryData()

  const badgesToDisplay = useMemo(() => {
    if (parameters?.display?.toolbar) {
      console.log(storyData)

      return ['badger', 'badger']
    }

    return []
  }, [badges, parameters])

  return (
    parameters?.display?.toolbar && (
      <span key={TOOL_ID}>~{badgesToDisplay.join(' ~ ')}~</span>
    )
  )
}
