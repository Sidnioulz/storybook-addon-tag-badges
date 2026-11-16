import React from 'react'
import type {
  API_HashEntry,
  API_SidebarOptions,
} from 'storybook/internal/types'

import { Sidebar } from './components/Sidebar'

export type LabelContext = Parameters<
  NonNullable<API_SidebarOptions['renderLabel']>
>[2]

/**
 * Whether a sidebar label may show a badge for this entry. The mobile bottom
 * bar shows labels as plain text, so it never shows badges.
 */
export function canShowBadge(item: API_HashEntry, context?: LabelContext) {
  return context?.location !== 'bottom-bar' && item.type !== 'root'
}

/**
 * Renders the sidebar label of an entry with its badge. Use as Storybook's
 * `sidebar.renderLabel` option, along with `renderAriaLabel`.
 *
 * It calls no hooks, so Storybook may call it from any of its components.
 * Returns `undefined` when the entry can't show a badge, so that Storybook
 * renders its default label.
 */
export function renderLabel(
  item: API_HashEntry,
  api?: unknown,
  context?: LabelContext,
) {
  if (!canShowBadge(item, context)) {
    return undefined
  }

  return (
    <Sidebar key={item.id} item={item}>
      {item.name}
    </Sidebar>
  )
}
