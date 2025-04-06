import type { ComponentProps } from 'react'
import type { TooltipMessage } from '@storybook/components'
import type { HashEntry } from 'storybook/manager-api'
import type { CSSObject } from 'storybook/theming'

import { getTagParts, getTagPrefix, getTagSuffix } from '../utils/tag'

/**
 * Properties of a badge to be displayed.
 */
export interface Badge {
  /** The text content of the badge. */
  text: string

  /** Either a style preset provided by the addon, or a custom emotion object. */
  style?:
    | 'grey'
    | 'green'
    | 'turquoise'
    | 'blue'
    | 'purple'
    | 'pink'
    | 'red'
    | 'orange'
    | 'yellow'
    | CSSObject

  /** The tooltip text to display when hovering over the badge (optional). */
  tooltip?: string | ComponentProps<typeof TooltipMessage>
}

/**
 * Either a Badge config or a function that generates it from a tag and HashEntry.
 * The function receives the current HashEntry and tag content, and a `getTagParts`
 * helper function to extract the prefix and suffix of the tag. It must return a
 * Badge config object.
 */
export type BadgeOrBadgeFn =
  | ((params: {
      entry: HashEntry
      getTagParts: typeof getTagParts
      getTagPrefix: typeof getTagPrefix
      getTagSuffix: typeof getTagSuffix
      tag: string
    }) => Badge)
  | Badge
