import type { API } from 'storybook/manager-api'
import type { API_HashEntry } from 'storybook/internal/types'

import { getBadgeProps } from './components/Badge'
import { canShowBadge, type LabelContext } from './renderLabel'
import { getBadgesToDisplay } from './useBadgesToDisplay'
import { readConfig } from './utils/config'

/**
 * Returns the accessible name of a sidebar entry: its name, followed by the
 * text of the badge that `renderLabel` shows next to it. Use as Storybook's
 * `sidebar.renderAriaLabel` option, along with `renderLabel`.
 *
 * Pass the `api` Storybook provides, so that badges inherited from a parent
 * entry are skipped like they are in `renderLabel`.
 */
export function renderAriaLabel(
  item: API_HashEntry,
  api?: API,
  context?: LabelContext,
): string {
  if (!canShowBadge(item, context)) {
    return item.name
  }

  const [firstBadge] = getBadgesToDisplay({
    api,
    context: 'sidebar',
    parameters: readConfig(),
    parent: 'parent' in item ? item.parent : undefined,
    refId: item.refId,
    tags: item.tags,
    type: item.type,
  })
  if (!firstBadge) {
    return item.name
  }

  const { text } = getBadgeProps(
    firstBadge.badge,
    item,
    firstBadge.tag,
    'sidebar',
  )
  return typeof text === 'string' && text ? `${item.name}. ${text}` : item.name
}
