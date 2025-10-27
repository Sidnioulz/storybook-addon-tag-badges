import React, { type FC } from 'react'
import { addons, type API } from 'storybook/manager-api'
import { styled } from 'storybook/theming'

import { KEY, TOOL_ID } from '../constants'
import { type TagBadgeParameters } from '../types/TagBadgeParameters'
import { WithBadge } from './Badge'
import { useBadgesToDisplay } from '../useBadgesToDisplay'

// import icon from '../../static/icon.png?inline'

interface ToolProps {
  api: API
}

const Separator = styled.div`
  content: ' ';
  width: 1px;
  height: 20px;
  background: rgba(255, 255, 255, 0.1);
  margin-left: 2px;
  margin-right: 2px;
  display: inline-block;
`

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  &:last-child div:last-child {
    display: none;
  }
`

console.log('yaa')
export const Tool: FC<ToolProps> = function Tool({ api }) {
  const { [KEY]: parameters } = addons.getConfig() as {
    [KEY]: TagBadgeParameters
  }

  console.log('yo')
  const storyData = api.getCurrentStoryData()
  const { tags, type } = storyData ?? {}

  const badgesToDisplay = useBadgesToDisplay({
    context: 'toolbar',
    parameters,
    tags,
    type,
  })

  return badgesToDisplay.length ? (
    <Root key={TOOL_ID}>
      {/* <img src={icon} alt="demo" width={14} height={14} /> */}
      {badgesToDisplay.map(({ badge, tag }) => (
        <WithBadge
          config={badge}
          context="toolbar"
          entry={storyData}
          key={tag}
          tag={tag}
        />
      ))}
      <Separator />
    </Root>
  ) : (
    ''
  )
}
