import type { HashEntry } from 'storybook/manager-api'
import type { CSSObject } from 'storybook/theming'

import { getTagParts, getTagPrefix, getTagSuffix } from '../utils/tag'

/**
 * A link displayed at the bottom of a badge tooltip.
 */
export interface BadgeTooltipLink {
  /** The text content of the link. */
  title: string

  /** An URL to open when the link is clicked (optional). */
  href?: string

  /** A callback to run when the link is clicked (optional). */
  onClick?: () => void
}

/**
 * The content of a rich badge tooltip, with an optional title, description
 * and list of links. Replaces the `TooltipMessage` props formerly exported
 * by `storybook/internal/components`, which Storybook 11 removes.
 */
export interface BadgeTooltipMessage {
  /** The title of the tooltip (optional). */
  title?: React.ReactNode

  /** The description text of the tooltip (optional). */
  desc?: React.ReactNode

  /** Links to display below the tooltip content (optional). */
  links?: BadgeTooltipLink[]
}

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
  tooltip?: string | BadgeTooltipMessage
}

/**
 * Either a Badge config or a function that generates it from a tag and HashEntry.
 * The function receives the current HashEntry and tag content, and a `getTagParts`
 * helper function to extract the prefix and suffix of the tag. It must return a
 * Badge config object.
 */
export type BadgeOrBadgeFn =
  | ((params: {
      context: 'mdx' | 'sidebar' | 'toolbar'
      entry: HashEntry | undefined
      getTagParts: typeof getTagParts
      getTagPrefix: typeof getTagPrefix
      getTagSuffix: typeof getTagSuffix
      tag: string
    }) => Badge)
  | Badge
