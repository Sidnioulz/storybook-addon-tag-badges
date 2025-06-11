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

function normalisePattern(
  pattern: string | RegExp | undefined,
): string | RegExp {
  if (pattern === undefined) {
    return /.*/
  }

  if (typeof pattern === 'string') {
    let patternWithBoundaries = pattern
    if (!patternWithBoundaries.startsWith('^')) {
      patternWithBoundaries = `^${patternWithBoundaries}`
    }
    if (!patternWithBoundaries.endsWith('$')) {
      patternWithBoundaries += '$'
    }

    return new RegExp(patternWithBoundaries)
  }

  return pattern
}

/**
 * Checks if a given tag matches any of the provided patterns.
 * Patterns can be regular expressions, strings, or objects with prefix and suffix patterns.
 * @param tag The tag to match against the patterns.
 * @param patterns The pattern or patterns to match the tag against.
 * @returns `true` if the tag matches any of the patterns, `false` otherwise.
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
      const prefixPattern = normalisePattern(pattern.prefix)
      const suffixPattern = normalisePattern(pattern.suffix)

      const matchesPrefix = prefix.match(prefixPattern)
      const matchesSuffix = suffix && suffix.match(suffixPattern)

      if (matchesPrefix && matchesSuffix) {
        return true
      }
    }
  }

  return false
}

/**
 * Filters an array of tags based on the provided pattern configuration.
 * @param tags An array of tags to filter.
 * @param config The pattern configuration to match tags against.
 * @returns An array of tags that match the given pattern configuration.
 */
export function matchTags(tags: string[], config: TagPatterns): string[] {
  return tags.filter((tag) => matchTag(tag, config))
}
