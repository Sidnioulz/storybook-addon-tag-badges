import { useMemo } from 'react'
import { type API, useStorybookApi } from 'storybook/manager-api'

import { DisplayOutcome, shouldDisplay } from './utils/display'
import { matchTags } from './utils/tag'
import type {
  API_ComponentEntry,
  API_GroupEntry,
  API_HashEntry,
  API_LeafEntry,
} from 'storybook/internal/types'
import { TagBadgeParameters } from './types/TagBadgeParameters'
import { BadgeOrBadgeFn } from './types/Badge'

interface UseBadgesToDisplayOptions {
  context: 'mdx' | 'sidebar' | 'toolbar'
  parameters: TagBadgeParameters
  parent?: string
  refId?: string
  tags: string[]
  type:
    | API_ComponentEntry['type']
    | API_GroupEntry['type']
    | API_LeafEntry['type']
}

type BadgesToDisplay = { badge: BadgeOrBadgeFn; tag: string }[]

function _useBadgesToDisplay({
  api,
  context,
  parameters,
  parent,
  refId,
  tags,
  type,
}: UseBadgesToDisplayOptions & {
  api?: API
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
      parentTags = resolvedParent.tags
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
        const displayParent = _useBadgesToDisplay({
          api,
          context,
          parameters,
          parent: resolvedParent.parent,
          refId,
          tags: parentTags,
          type: resolvedParent.type,
        })

        if (displayParent.find(({ tag }) => tag === current.tag)) {
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
  parameters,
  parent,
  refId,
  tags,
  type,
}: UseBadgesToDisplayOptions): BadgesToDisplay {
  const api = useStorybookApi()

  return useMemo(
    () =>
      _useBadgesToDisplay({
        api,
        context,
        parameters,
        parent,
        refId,
        tags,
        type,
      }),
    [context, parameters, parent, refId, tags, type],
  )
}
