import type { ArrayElement } from '../types/ArrayElement'
import type { TagBadgeParameters } from '../types/TagBadgeParameters'
import type {
  Display,
  NormalisedDisplay,
  MDXDisplayOptionItem,
  SidebarDisplayOptionItem,
  ToolbarDisplayOptionItem,
} from '../types/DisplayOptions'

export interface ShouldDisplayOptions {
  config: Partial<ArrayElement<TagBadgeParameters>>
  context: 'mdx' | 'sidebar' | 'toolbar'
  type: 'test' | 'story' | 'docs' | 'component' | 'group' | 'root'
}

export const DISPLAY_DEFAULTS = {
  mdx: ['story', 'component'],
  sidebar: [
    { type: 'test', skipInherited: true },
    { type: 'story', skipInherited: true },
    { type: 'docs', skipInherited: true },
    { type: 'component', skipInherited: false },
    { type: 'group', skipInherited: false },
  ],
  toolbar: ['test', 'docs', 'story'],
} satisfies NormalisedDisplay

function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value]
}

export function normaliseDisplay(display?: Display): {
  mdx: MDXDisplayOptionItem[]
  sidebar: SidebarDisplayOptionItem[]
  toolbar: ToolbarDisplayOptionItem[]
} {
  return {
    mdx: toArray(display?.mdx ?? DISPLAY_DEFAULTS.mdx),
    sidebar: toArray(display?.sidebar ?? DISPLAY_DEFAULTS.sidebar),
    toolbar: toArray(display?.toolbar ?? DISPLAY_DEFAULTS.toolbar),
  }
}

export enum DisplayOutcome {
  NEVER = 'never',
  SKIP_INHERITED = 'skip-inherited',
  ALWAYS = 'always',
}

/**
 * Determines whether a badge should be displayed based on the provided config
 * and based on the display context (toolbar, sidebar).
 *
 * @param options The options to determine display.
 * @param options.config The configuration for the badge.
 * @param options.context The context where the badge might be displayed.
 * @param options.type The type of the current entry.
 *
 * @returns {DisplayOutcome} `ALWAYS` if the badge should be displayed, `NEVER` if
 * it shouldn't, and `SKIP_INHERITED` if it should only when the parent entry doesn't
 * show a badge for the same tag already.
 */
export function shouldDisplay({
  config,
  context,
  type,
}: ShouldDisplayOptions): DisplayOutcome {
  if (type === 'root') {
    return DisplayOutcome.NEVER
  }

  for (const condition of normaliseDisplay(config.display)[context]) {
    // If options contain the value `true`, we must show badges for all types.
    if (condition === true) {
      return DisplayOutcome.ALWAYS
    }

    // Inversely, if `false` is found, we must never display badges.
    if (condition === false) {
      return DisplayOutcome.NEVER
    }

    // For MDX and toolbar badges, we may have strings that match a content type.
    // If a condition matches the type in parameters, we know we can show the badge.
    // NOTE: we don't actually check for context here to account for users who don't
    // use TypeScript and mistakenly pass strings to the 'sidebar' context options.
    if (condition === type) {
      // If the type is found, we must show badges for this type.
      return DisplayOutcome.ALWAYS
    }

    // For sidebar badges, we must account for the `skipInherited` property.
    if (context === 'sidebar' && typeof condition === 'object') {
      // When a type is defined, it must always match the type of the HashEntry.
      // If it doesn't, we don't return true yet.
      if (condition.type === type) {
        return condition.skipInherited
          ? DisplayOutcome.SKIP_INHERITED
          : DisplayOutcome.ALWAYS
      }
    }
  }

  return DisplayOutcome.NEVER
}
