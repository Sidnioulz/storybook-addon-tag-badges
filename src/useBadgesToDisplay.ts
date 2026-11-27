import { useMemo } from 'react'
import { type API, useStorybookApi } from 'storybook/manager-api'

import { DisplayOutcome, getDisplayType, shouldDisplay } from './utils/display'
import { getEntryTags } from './utils/entryTags'
import { matchTags } from './utils/tag'
import type { API_HashEntry } from 'storybook/internal/types'
import { TagBadgeParameters } from './types/TagBadgeParameters'
import { BadgeOrBadgeFn } from './types/Badge'
import type { DisplayEntryType } from './types/DisplayOptions'

interface UseBadgesToDisplayOptions {
  context: 'mdx' | 'sidebar' | 'toolbar'
  /**
   * The `legacyTagIntersection` option of the addon, which changes the tags
   * of the ancestors that inherited badges are checked against.
   */
  legacyTagIntersection?: boolean
  parameters: TagBadgeParameters
  parent?: string
  refId?: string
  tags: string[]
  type: DisplayEntryType
}

type BadgesToDisplay = { badge: BadgeOrBadgeFn; tag: string }[]

/**
 * Computes the badges to display for an entry, in order of priority. Unlike
 * `useBadgesToDisplay`, it calls no hooks, so it may run outside of a React
 * render, e.g. in Storybook's `renderAriaLabel` callback.
 *
 * @param options.api The manager API, used to resolve parent entries for
 * `skipInherited`. Without it, inherited badges are not skipped.
 * @param options.includeInherited Also returns the badges skipped because an
 * ancestor shows them, so that descendants skip them too.
 */
export function getBadgesToDisplay({
  api,
  context,
  includeInherited = false,
  legacyTagIntersection,
  parameters,
  parent,
  refId,
  tags,
  type,
}: UseBadgesToDisplayOptions & {
  api?: API
  includeInherited?: boolean
}): BadgesToDisplay {
  /* Handle potentially missing data from callees. */
  if (!tags || !type) {
    return []
  }

  let parentTags: string[] | undefined
  let resolvedParent: API_HashEntry | undefined
  if (api && parent) {
    // Composed Storybooks need refId so the manager API resolves the parent from
    // the correct child ref. Standalone instances do not set refId, and leaving
    // it undefined preserves the existing local resolution behavior.
    resolvedParent = api.resolveStory(parent, refId)
    if (resolvedParent && resolvedParent.type !== 'root') {
      parentTags = getEntryTags(resolvedParent, { api, legacyTagIntersection })
    }
  }

  return (parameters || [])
    .map((config) => ({
      ...config,
      displayOutcome: shouldDisplay({ context, config, type }),
    }))
    .filter(({ displayOutcome }) => displayOutcome !== DisplayOutcome.NEVER)
    .flatMap((config) =>
      matchTags(tags, config.tags).map((tag) => ({
        badge: config.badge,
        displayOutcome: config.displayOutcome,
        tag,
      })),
    )
    .reduce((acc: BadgesToDisplay, current) => {
      if (
        current.displayOutcome === DisplayOutcome.SKIP_INHERITED &&
        resolvedParent &&
        resolvedParent.type !== 'root' &&
        parentTags?.includes(current.tag)
      ) {
        const shownAbove = getBadgesToDisplay({
          api,
          context,
          includeInherited: true,
          legacyTagIntersection,
          parameters,
          parent: resolvedParent.parent,
          refId,
          tags: parentTags,
          type: getDisplayType(resolvedParent),
        })

        if (
          !includeInherited &&
          shownAbove.some(({ tag }) => tag === current.tag)
        ) {
          return acc
        }
      }

      if (acc.every(({ tag }) => tag !== current.tag)) {
        acc.push(current)
      }
      return acc
    }, [])
}

export function useBadgesToDisplay({
  context,
  legacyTagIntersection,
  parameters,
  parent,
  refId,
  tags,
  type,
}: UseBadgesToDisplayOptions): BadgesToDisplay {
  const api = useStorybookApi()

  return useMemo(
    () =>
      getBadgesToDisplay({
        api,
        context,
        legacyTagIntersection,
        parameters,
        parent,
        refId,
        tags,
        type,
      }),
    [context, legacyTagIntersection, parameters, parent, refId, tags, type],
  )
}
