import { HashEntry } from '@storybook/manager-api'
import type { ArrayElement } from '../types/ArrayElement'
import type { TagBadgeParameters } from '../types/TagBadgeParameters'
import type { Display } from '../types/DisplayOption'

export interface ShouldDisplayOptions {
  config: Partial<ArrayElement<TagBadgeParameters>>
  context: 'sidebar' | 'toolbar'
  type: HashEntry['type']
}

export const DISPLAY_DEFAULTS = {
  sidebar: ['component'],
  toolbar: ['docs', 'story'],
} satisfies Display

function normaliseDisplayProperty(
  value: boolean | HashEntry['type'] | HashEntry['type'][] | undefined,
  defaultValue: HashEntry['type'][],
): HashEntry['type'][] {
  if (value === undefined) {
    return [...defaultValue]
  }
  if (value === true) {
    return ['component', 'docs', 'story', 'group']
  }
  if (value === false) {
    return []
  }
  if (typeof value === 'string') {
    return [value]
  }
  return [...value]
}

export function normaliseDisplay(display?: Display): {
  sidebar: HashEntry['type'][]
  toolbar: HashEntry['type'][]
} {
  return {
    sidebar: normaliseDisplayProperty(
      display?.sidebar,
      DISPLAY_DEFAULTS.sidebar,
    ),
    toolbar: normaliseDisplayProperty(
      display?.toolbar,
      DISPLAY_DEFAULTS.toolbar,
    ),
  }
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
 * @returns {boolean} `true` if the badge should be displayed, `false` otherwise.
 */
export function shouldDisplay({ config, context, type }: ShouldDisplayOptions) {
  if (type === 'root') {
    return false
  }

  return normaliseDisplay(config.display)[context].includes(type)
}
