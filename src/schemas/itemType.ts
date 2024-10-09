import { z } from 'zod'

/**
 * TODO doc
 */
export const ItemTypeSchema = z.enum(['component', 'docs', 'story'])

/**
 * TODO doc
 */
export type ItemType = z.infer<typeof ItemTypeSchema>
