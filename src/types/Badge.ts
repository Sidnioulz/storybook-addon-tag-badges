import type { ComponentProps } from 'react'
import type { TooltipMessage } from '@storybook/components'
import type { HashEntry } from '@storybook/manager-api'
import { getTagParts, getTagPrefix, getTagSuffix } from 'src/utils/tag'

/**
 * Properties of a badge to be displayed.
 */
export interface Badge {
  /** The text content of the badge. */
  text: string
  /** The background colour of the badge (optional). */
  bgColor?: string
  /** The border colour of the badge (optional). */
  borderColor?: string
  /** The foreground (text) colour of the badge (optional). */
  fgColor?: string
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
