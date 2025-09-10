import React from 'react'

import { Badge } from './Badge'
import type { Badge as BadgeConfigType } from '../types/Badge'

export const CustomBadge: React.FC<BadgeConfigType> = (props) => {
  return <Badge context="mdx" {...props} />
}
