import { z } from 'zod'
import { BadgeOrBadgeFnSchema } from 'src/schemas/badge'
import { TagsSchema } from 'src/schemas/tags'

export const ParametersSchema = z.object({
  display: z.object({
    sidebar: z.boolean().optional().default(true),
    toolbar: z.boolean().optional().default(true),
  }),
  match: z.array(
    z.object({
      tags: TagsSchema,
      badge: BadgeOrBadgeFnSchema,
    }),
  ),
})

/**
 * TODO doc
 */
export type Parameters = z.infer<typeof ParametersSchema>
