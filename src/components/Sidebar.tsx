import React, { type FC, type ReactNode } from 'react'
import { addons } from '@storybook/manager-api'
import type { API_HashEntry } from '@storybook/types'
import { styled } from '@storybook/theming'

import { KEY } from '../constants'
import { TagBadgeParameters } from '../types/TagBadgeParameters'
import { useBadgesToDisplay } from '../useBadgesToDisplay'
import { WithBadge } from './Badge'

interface SidebarProps {
  children: ReactNode
  item: API_HashEntry
}

const Container = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  margin-right: 32px;
`

export const Sidebar: FC<SidebarProps> = ({ children, item }) => {
  const { [KEY]: parameters } = addons.getConfig() as {
    [KEY]: TagBadgeParameters
  }

  if (
    item.type !== 'component' &&
    item.type !== 'docs' &&
    item.type !== 'story'
  ) {
    return children
  }

  const badgesToDisplay = useBadgesToDisplay({
    context: 'sidebar',
    depth: item.depth,
    parameters,
    tags: item.tags,
    type: item.type,
  })

  return (
    <Container>
      {children}
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
