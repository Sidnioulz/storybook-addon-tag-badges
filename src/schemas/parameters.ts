import { z } from 'zod'
import { BadgeOrBadgeFnSchema } from 'src/schemas/badge'
import { TagPatternsSchema } from 'src/schemas/tags'
import { ItemTypeSchema } from './itemType'

export const ParametersSchema = z.array(
  z.object({
    display: z
      .object({
        sidebar: z.array(ItemTypeSchema).optional(),
        toolbar: z.array(ItemTypeSchema).optional(),
      })
      .optional(),
    tags: TagPatternsSchema,
    badge: BadgeOrBadgeFnSchema,
  }),
)

/**
 * TODO doc
 */
export type Parameters = z.infer<typeof ParametersSchema>
