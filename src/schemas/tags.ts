import { z } from 'zod'

export const TagSchema = z.union([
  z.string(),
  z.object({
    prefix: z.string().optional(),
    suffix: z.string().optional(),
  }),
])

/**
 * TODO doc
 */
export const TagsSchema = z.union([TagSchema, z.array(TagSchema)])

/**
 * TODO doc
 */
export type Tags = z.infer<typeof TagsSchema>

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
