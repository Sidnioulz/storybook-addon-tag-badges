import type { TagPatterns } from '../schemas/tags'

/**
 * TODO doc
 * @param tag
 * @returns
 */
export function getTagParts(tag: string): {
  prefix: string
  suffix: string | null
} {
  const [prefix, ...rest] = tag.split(':')
  return { prefix, suffix: rest.join(':') || null }
}

/**
 * TODO doc
 * @param tag
 * @returns
 */
export function getTagPrefix(tag: string): string {
  return getTagParts(tag).prefix
}

/**
 * TODO doc
 * @param tag
 * @returns
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
    if (typeof pattern === 'string' || pattern instanceof RegExp) {
      if (tag.match(pattern)) {
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
