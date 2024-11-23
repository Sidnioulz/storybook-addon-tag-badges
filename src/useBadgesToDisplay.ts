import { useMemo } from 'react'

import { shouldDisplay } from './utils/display'
import { matchTags } from './utils/tag'
import { API_ComponentEntry, API_LeafEntry } from '@storybook/types'
import { TagBadgeParameters } from './types/TagBadgeParameters'
import { BadgeOrBadgeFn } from './types/Badge'

interface UseBadgesToDisplayOptions {
  context: 'sidebar' | 'toolbar'
  depth?: number
  parameters: TagBadgeParameters
  tags: string[]
  type: API_ComponentEntry['type'] | API_LeafEntry['type']
}

type BadgesToDisplay = { badge: BadgeOrBadgeFn; tag: string }[]

export function useBadgesToDisplay({
  context,
  depth,
  parameters,
  tags,
  type,
}: UseBadgesToDisplayOptions): BadgesToDisplay {
  return useMemo(() => {
    return (parameters || [])
      .filter((config) => shouldDisplay({ context, config, depth, type }))
      .flatMap((config) =>
        matchTags(tags, config.tags).map((tag) => ({
          badge: config.badge,
          tag,
        })),
      )
      .reduce((acc: BadgesToDisplay, current) => {
        if (acc.every(({ tag }) => tag !== current.tag)) {
          acc.push(current)
        }
        return acc
      }, [])
  }, [parameters, depth, tags, type])
}
