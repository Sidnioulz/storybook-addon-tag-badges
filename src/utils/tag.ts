import type { Tags } from 'src/schemas/tags'

/**
 * TODO doc
 * @param tag
 * @returns
 */
export function getTagParts(tag: string): {
  prefix: string
  suffix: string | undefined
} {
  const [prefix, ...rest] = tag.split(':')
  return { prefix, suffix: rest.join(':') }
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
export function getTagSuffix(tag: string): string | undefined {
  return getTagParts(tag).suffix
}

/**
 * TODO doc
 * @param tag
 * @param config
 * @returns
 */
export function matchTag(tag: string, config: Tags): boolean {
  const normalisedConfig = [config].flat()
  for (const config of normalisedConfig) {
    if (typeof config === 'string') {
      if (tag.match(config)) {
        return true
      }
    } else {
      const prefix = config.prefix ?? '[^:]+'
      const suffix = config.suffix ?? '.+'

      if (tag.match(new RegExp(`^${prefix}:${suffix}$`))) {
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
export function matchTags(tags: string[], config: Tags): string[] {
  return tags.filter((tag) => matchTag(tag, config))
}
