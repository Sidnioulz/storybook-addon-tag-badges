import { BadgeOrBadgeFn } from './Badge'
import { Display } from './DisplayOption'
import { TagPatterns } from './TagPattern'

/**
 * Configuration that maps a tag or tag matching pattern to the config
 * that can render a badge, and to display conditions.
 */
interface TagBadgeParameter {
  /**
   * Controls where badges are rendered and for what type of content.
   */
  display?: Display
  /**
   * Defines the string, RegExp or tag structures to match against
   * for this badge config to be used.
   */
  tags: TagPatterns
  /**
   * Defines the appearance and content of the badge to display. Can be
   * a function that dynamically generates a badge based on the matched
   * content and tag.
   */
  badge: BadgeOrBadgeFn
}

/**
 * Parameters of this addon. Each item maps a tag or tag matching pattern
 * to the config that can render a badge, and to display conditions.
 */
export type TagBadgeParameters = TagBadgeParameter[]
