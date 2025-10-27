import { useMemo } from 'react'
import { type API, useStorybookApi } from 'storybook/manager-api'

import { DisplayOutcome, shouldDisplay } from './utils/display'
import { matchTags } from './utils/tag'
import { TagBadgeParameters } from './types/TagBadgeParameters'
import { BadgeOrBadgeFn } from './types/Badge'
import { getItemType, itemIsRoot } from './itemTypes'

import type {
  API_ComponentEntry,
  API_DocsEntry,
  API_GroupEntry,
  API_HashEntry,
  API_StoryEntry,
  API_TestEntry,
} from 'storybook/internal/types'

interface UseBadgesToDisplayOptions {
  context: 'mdx' | 'sidebar' | 'toolbar'
  parameters: TagBadgeParameters
  parent?: string
  tags: string[]
  type: 'component' | 'group' | 'docs' | 'story' | 'test'
}

type BadgesToDisplay = { badge: BadgeOrBadgeFn; tag: string }[]

function _useBadgesToDisplay({
  api,
  context,
  parameters,
  parent,
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
    resolvedParent = api.resolveStory(parent)
    if (resolvedParent && getItemType(resolvedParent) !== 'root') {
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
        !itemIsRoot(resolvedParent) &&
        parentTags?.includes(current.tag)
      ) {
        const displayParent = _useBadgesToDisplay({
          api,
          context,
          parameters,
          parent: resolvedParent.parent,
          tags: parentTags,
          type: getItemType<
            | API_ComponentEntry
            | API_DocsEntry
            | API_GroupEntry
            | API_StoryEntry
            | API_TestEntry
          >(resolvedParent),
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
        tags,
        type,
      }),
    [context, parameters, parent, tags, type],
  )
}
