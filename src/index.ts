export * from './utils/tag'
export { defaultConfig } from './defaultConfig'
export { DISPLAY_DEFAULTS as defaultDisplay } from './utils/display'
export { renderLabel } from './renderLabel'
export { Sidebar } from './components/Sidebar'
export { CustomBadge } from './components/CustomBadge'
export { MDXBadges } from './components/MDXBadges'

export type { Badge, BadgeOrBadgeFn } from './types/Badge'
export type {
  Display,
  MDXDisplayOptions,
  SidebarDisplayOptions,
  ToolbarDisplayOptions,
} from './types/DisplayOptions'
export type { TagBadgeParameters } from './types/TagBadgeParameters'
export type { TagPattern, TagPatterns } from './types/TagPattern'
