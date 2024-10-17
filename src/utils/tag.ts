import type { TagPatterns } from '../types/TagPattern'

/**
 * Splits a tag into a prefix and suffix, separated by a colon.
 * If no colons are present, `suffix` is `null`. If more than one
 * colons are present, `suffix` is a concatenation of all the parts
 * beyond the first one.
 * @param tag The tag being queried.
 * @returns The prefix and suffix.
 */
export function getTagParts(tag: string): {
  prefix: string
  suffix: string | null
} {
  const [prefix, ...rest] = tag.split(':')
  return { prefix, suffix: rest.join(':') || null }
}

/**
 * Gets the prefix of a tag, i.e. the part before the
 * colon if it contains one, or the whole tag otherwise.
 * @param tag The tag being queried.
 * @returns The prefix or the whole tag.
 */
export function getTagPrefix(tag: string): string {
  return getTagParts(tag).prefix
}

/**
 * Gets the suffix of a tag, i.e. the part after the
 * colon if it contains one, or `null` otherwise.
 * @param tag The tag being queried.
 * @returns The suffix if it exists.
 */
export function getTagSuffix(tag: string): string | null {
  return getTagParts(tag).suffix
}

/**
 * TODO doc
 * @param tag
 * @param patterns
 * @returns
 */
export function matchTag(tag: string, patterns: TagPatterns): boolean {
  const normalisedPatterns = [patterns].flat()
  for (const pattern of normalisedPatterns) {
    if (pattern instanceof RegExp) {
      if (tag.match(pattern)) {
        return true
      }
    } else if (typeof pattern === 'string') {
      if (tag === pattern) {
        return true
      }
    } else {
      const { prefix, suffix } = getTagParts(tag)
      const prefixPattern = pattern.prefix ?? '[^:]+'
      const suffixPattern = pattern.suffix ?? '.+'

      if (
        prefix.match(prefixPattern) &&
        ((suffix && suffixPattern) || (!suffix && !suffixPattern)) &&
        suffix?.match(suffixPattern)
      ) {
        return true
      }
    }
  }

  return false
}

/**
 * TODO doc
 * @param tags
 * @param config
 * @returns
 */
export function matchTags(tags: string[], config: TagPatterns): string[] {
  return tags.filter((tag) => matchTag(tag, config))
}
