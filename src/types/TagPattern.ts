/**
 * Represents a pattern for matching tags.
 * It can be a string, a RegExp, or an object where only the prefix
 * or suffix of the tag is matched.
 */
export type TagPattern =
  | string
  | RegExp
  | {
      prefix?: string | RegExp
      suffix?: string | RegExp
    }

/**
 * Collection of tag patterns.
 */
export type TagPatterns = TagPattern | TagPattern[]
