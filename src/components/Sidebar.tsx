import React, { type FC, type ReactNode, useRef } from 'react'
import type { API_HashEntry } from 'storybook/internal/types'
import { styled } from 'storybook/theming/emotion'

import { useBadgesToDisplay } from '../useBadgesToDisplay'
import { readConfig } from '../utils/config'
import { useRowEndAlignment } from '../utils/rowEndAlignment'
import { WithBadge } from './Badge'

export interface SidebarProps {
  children: ReactNode
  item: API_HashEntry
  /**
   * @deprecated Has no effect. Badges are aligned with the row's status icons
   * and context menu button automatically.
   */
  hasStatusWithUI?: boolean
}

// Sidebar rows have a fixed height, so the label and badge share one line.
// Each column can take up to half of the row, plus whatever the other column
// leaves unused. Both truncate with an ellipsis when they don't fit.
const Container = styled.div({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, max-content) minmax(0, max-content)',
  justifyContent: 'space-between',
  alignItems: 'center',
  columnGap: 6,
})

const Label = styled.span({
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

/**
 * Renders a sidebar label followed by the badge of the entry's
 * highest-priority tag, if any.
 */
export const Sidebar: FC<SidebarProps> = ({ children, item }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const badgesToDisplay = useBadgesToDisplay({
    context: 'sidebar',
    parameters: readConfig(),
    parent: 'parent' in item ? item.parent : undefined,
    refId: item.refId,
    tags: item.tags,
    type: item.type,
  })
  const [firstBadge] = badgesToDisplay
  useRowEndAlignment(containerRef, Boolean(firstBadge))

  if (!firstBadge) {
    return children
  }

  return (
    <Container ref={containerRef}>
      <Label>{children}</Label>
      <WithBadge
        config={firstBadge.badge}
        context="sidebar"
        entry={item}
        tag={firstBadge.tag}
      />
    </Container>
  )
}
