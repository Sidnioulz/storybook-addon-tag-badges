import { z } from 'zod'

export const BadgeSchema = z.object({
  text: z.string(),
  bgColor: z.string().optional(),
  borderColor: z.string().optional(),
  fgColor: z.string().optional(),
  tooltip: z.string().optional(),
})

export const BadgeOrBadgeFnSchema = z.union([
  z
    .function()
    .args(z.object({ entry: z.object({}), tag: z.string() }))
    .returns(BadgeSchema),
  BadgeSchema,
])

/**
 * TODO doc
 */
export type Badge = z.infer<typeof BadgeSchema>

/**
 * TODO doc
 */
export type BadgeOrBadgeFn = z.infer<typeof BadgeOrBadgeFnSchema>
