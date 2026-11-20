import React, { type FC, type ReactNode, useRef } from 'react'
import type { API_HashEntry } from 'storybook/internal/types'
import { styled } from 'storybook/theming/emotion'

import type { BadgeOrBadgeFn } from '../types/Badge'
import { useRowEndAlignment } from '../utils/rowEndAlignment'
import { WithBadge } from './Badge'

export interface SidebarLabelProps {
  children: ReactNode
  entry: API_HashEntry
  badge: { config: BadgeOrBadgeFn; tag: string }
  compact: boolean
}

// Sidebar rows have a fixed height, so the label and badge share one line.
// Full-size badges and labels each take up to half of the row, plus whatever
// the other leaves unused. Compact badges have a fixed width, and the label
// takes the rest. Labels and full-size badges truncate with an ellipsis.
const Container = styled.div<{ compact: boolean }>(({ compact }) => ({
  display: 'grid',
  gridTemplateColumns: compact
    ? 'minmax(0, 1fr) auto'
    : 'minmax(0, max-content) minmax(0, max-content)',
  justifyContent: 'space-between',
  alignItems: 'center',
  columnGap: 6,
}))

const Label = styled.span({
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

/**
 * Lays out a sidebar label followed by a badge, aligned with the badges of
 * other rows.
 */
export const SidebarLabel: FC<SidebarLabelProps> = ({
  badge,
  children,
  compact,
  entry,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  useRowEndAlignment(containerRef)

  return (
    <Container compact={compact} ref={containerRef}>
      <Label>{children}</Label>
      <WithBadge
        compact={compact}
        config={badge.config}
        context="sidebar"
        entry={entry}
        tag={badge.tag}
      />
    </Container>
  )
}
