import { useMemo } from 'react'

import { DisplayOutcome, shouldDisplay } from './utils/display'
import { matchTags } from './utils/tag'
import { API_ComponentEntry, API_LeafEntry } from '@storybook/types'
import { TagBadgeParameters } from './types/TagBadgeParameters'
import { BadgeOrBadgeFn } from './types/Badge'

interface UseBadgesToDisplayOptions {
  context: 'sidebar' | 'toolbar'
  parameters: TagBadgeParameters
  parentTags?: string[]
  tags: string[]
  type: API_ComponentEntry['type'] | API_LeafEntry['type']
}

type BadgesToDisplay = { badge: BadgeOrBadgeFn; tag: string }[]

export function useBadgesToDisplay({
  context,
  parameters,
  parentTags,
  tags,
  type,
}: UseBadgesToDisplayOptions): BadgesToDisplay {
  return useMemo(() => {
    /* Handle potentially missing data from callees. */
    if (!tags || !type) {
      return []
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
      .filter(
        ({ displayOutcome, tag }) =>
          displayOutcome !== DisplayOutcome.SKIP_INHERITED ||
          !parentTags?.includes(tag),
      )
      .reduce((acc: BadgesToDisplay, current) => {
        if (acc.every(({ tag }) => tag !== current.tag)) {
          acc.push(current)
        }
        return acc
      }, [])
  }, [parameters, parentTags, tags, type])
}
