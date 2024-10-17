import React, { type FC } from 'react'
import { addons } from '@storybook/manager-api'
import type {
  API_ComponentEntry,
  API_DocsEntry,
  API_StoryEntry,
} from '@storybook/types'
import { styled } from '@storybook/theming'

import { KEY } from '../constants'
import { TagBadgeParameters } from '../types/TagBadgeParameters'
import { useBadgesToDisplay } from '../useBadgesToDisplay'
import { WithBadge } from './Badge'

interface SidebarProps {
  item: API_DocsEntry | API_StoryEntry | API_ComponentEntry
}

function printTitleOrName(
  item: API_DocsEntry | API_StoryEntry | API_ComponentEntry,
) {
  return item.name
}

const Container = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  margin-right: 32px;
`

export const Sidebar: FC<SidebarProps> = ({ item }) => {
  const { [KEY]: parameters } = addons.getConfig() as {
    [KEY]: TagBadgeParameters
  }

  const badgesToDisplay = useBadgesToDisplay({
    context: 'sidebar',
    parameters,
    tags: item.tags,
    type: item.type,
  })

  return (
    <Container>
      {printTitleOrName(item)}
      {badgesToDisplay.length ? (
        <WithBadge
          config={badgesToDisplay[0].badge}
          context="sidebar"
          entry={item}
          tag={badgesToDisplay[0].tag}
        />
      ) : (
        ''
      )}
    </Container>
  )
}
