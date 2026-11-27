import React, { type FC, type ReactNode } from 'react'
import type { API_HashEntry } from 'storybook/internal/types'
import { useStorybookApi } from 'storybook/manager-api'

import { useBadgesToDisplay } from '../useBadgesToDisplay'
import { readConfig, readOptions } from '../utils/config'
import { getDisplayType } from '../utils/display'
import { getEntryTags } from '../utils/entryTags'
import { SidebarLabel } from './SidebarLabel'

export interface SidebarProps {
  children: ReactNode
  item: API_HashEntry
}

/**
 * Renders a sidebar label followed by the badge of the entry's
 * highest-priority tag, if any.
 */
export const Sidebar: FC<SidebarProps> = ({ children, item }) => {
  const api = useStorybookApi()
  const { compactSidebar = false, legacyTagIntersection } = readOptions()
  const [firstBadge] = useBadgesToDisplay({
    context: 'sidebar',
    legacyTagIntersection,
    parameters: readConfig(),
    parent: 'parent' in item ? item.parent : undefined,
    refId: item.refId,
    tags: getEntryTags(item, { api, legacyTagIntersection }),
    type: getDisplayType(item),
  })

  if (!firstBadge) {
    return children
  }

  return (
    <SidebarLabel
      badge={{ config: firstBadge.badge, tag: firstBadge.tag }}
      compact={compactSidebar}
      entry={item}
    >
      {children}
    </SidebarLabel>
  )
}
