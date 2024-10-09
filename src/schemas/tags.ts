import { z } from 'zod'

export const TagPatternSchema = z.union([
  z.string(),
  z.instanceof(RegExp),
  z.object({
    prefix: z.union([z.string(), z.instanceof(RegExp)]).optional(),
    suffix: z.union([z.string(), z.instanceof(RegExp)]).optional(),
  }),
])

/**
 * TODO doc
 */
export type TagPattern = z.infer<typeof TagPatternSchema>

/**
 * TODO doc
 */
export const TagPatternsSchema = z.union([
  TagPatternSchema,
  z.array(TagPatternSchema),
])

/**
 * TODO doc
 */
export type TagPatterns = z.infer<typeof TagPatternsSchema>
