import React, { type FC, type ReactNode } from 'react'
import { addons } from 'storybook/manager-api'
import type { API_HashEntry } from 'storybook/internal/types'
import { styled } from 'storybook/theming'

import { KEY } from '../constants'
import { TagBadgeParameters } from '../types/TagBadgeParameters'
import { useBadgesToDisplay } from '../useBadgesToDisplay'
import { WithBadge } from './Badge'
import {
  getItemType,
  itemIsComponent,
  itemIsGroup,
  itemIsRoot,
} from '#src/itemTypes.js'

export interface SidebarProps {
  children: ReactNode
  item: API_HashEntry
  hasStatusWithUI?: boolean
}

const Container = styled.div<{
  hasParentPadding: boolean
  hasStatusWithUI: boolean
}>(
  ({ hasParentPadding, hasStatusWithUI }) => `
  display: flex;
  flex: 1;
  justify-content: flex-end;
  flex-wrap: wrap;
  text-wrap-style: balance;
  gap: 4px;
  margin-right: ${hasStatusWithUI ? '6px' : hasParentPadding ? '28px' : '34px'};
`,
)

const Spacer = styled.div`
  flex: 1;
`

export const Sidebar: FC<SidebarProps> = ({
  children,
  item,
  hasStatusWithUI,
}) => {
  const { [KEY]: parameters } = addons.getConfig() as {
    [KEY]: TagBadgeParameters
  }

  if (itemIsRoot(item)) {
    return children
  }

  const badgesToDisplay = useBadgesToDisplay({
    context: 'sidebar',
    parameters,
    parent: item.parent,
    tags: item.tags,
    type: getItemType(item),
  })

  return (
    <Container
      hasParentPadding={itemIsComponent(item) || itemIsGroup(item)}
      hasStatusWithUI={hasStatusWithUI ?? false}
    >
      {children}
      <Spacer />
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
