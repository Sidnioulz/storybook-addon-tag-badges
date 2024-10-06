import { z } from 'zod'

export const BadgeConfigSchema = z.object({
  text: z.string(),
  bgColor: z.string().optional(),
  borderColor: z.string().optional(),
  fgColor: z.string().optional(),
  tooltip: z.string().optional(),
})

export const BadgeConfigOrBadgeFnSchema = z.union([
  z
    .function()
    .args(z.object({ entry: z.object({}), tag: z.string() }))
    .returns(BadgeConfigSchema),
  BadgeConfigSchema,
])

/**
 * TODO doc
 */
export type BadgeConfig = z.infer<typeof BadgeConfigSchema>

/**
 * TODO doc
 */
export type BadgeConfigOrBadgeFn = z.infer<typeof BadgeConfigOrBadgeFnSchema>
