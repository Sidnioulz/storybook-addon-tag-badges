import { HashEntry } from '@storybook/manager-api'
import type { ArrayElement } from '../types/ArrayElement'
import type { TagBadgeParameters } from '../types/TagBadgeParameters'
import type {
  Display,
  DisplayOption,
  DisplayOptionItem,
} from '../types/DisplayOption'
import { API_HashEntry } from '@storybook/types'

export interface ShouldDisplayOptions {
  config: Partial<ArrayElement<TagBadgeParameters>>
  depth?: number
  context: 'sidebar' | 'toolbar'
  type: HashEntry['type']
}

type NormalisedDisplayOption =
  | { depth: number; exactDepth?: boolean; type?: API_HashEntry['type'] }
  | { depth?: number; exactDepth?: boolean; type: API_HashEntry['type'] }

type NormalisedDisplayOptions = NormalisedDisplayOption[]

export const DISPLAY_DEFAULTS: {
  sidebar: NormalisedDisplayOptions
  toolbar: NormalisedDisplayOptions
} = {
  sidebar: [{ type: 'component' }, { type: 'group' }, { depth: 1 }],
  toolbar: [{ type: 'docs' }, { type: 'story' }],
}

function normaliseAtomicValue(
  v: DisplayOptionItem<API_HashEntry['type']>,
): NormalisedDisplayOption {
  if (typeof v === 'number') {
    return { depth: v, exactDepth: false }
  }
  if (typeof v === 'string') {
    return { type: v }
  }
  if (v === true) {
    // Will match every entry, always.
    return { depth: Infinity, exactDepth: false }
  }
  if (v === false) {
    // Will never be called in practice, only for TypeScript.
    // Will never match any entry.
    return { depth: -1, exactDepth: true }
  }
  return v
}

function normaliseDisplayProperty(
  value: DisplayOption<API_HashEntry['type']> | undefined,
  defaultValue: NormalisedDisplayOptions,
): NormalisedDisplayOptions {
  if (value === undefined) {
    return [...defaultValue]
  } else if (value === false) {
    return []
  } else if (!Array.isArray(value)) {
    return [normaliseAtomicValue(value)]
  } else {
    return (
      value
        // Remove false items in the array.
        .filter(Boolean)
        // Then normalise the items into fully-defined objects.
        .map(normaliseAtomicValue)
    )
  }
}

export function normaliseDisplay(display?: Display): {
  sidebar: NormalisedDisplayOptions
  toolbar: NormalisedDisplayOptions
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
 * @param options.depth An optional sidebar depth for the 'sidebar' context.
 * @param options.context The context where the badge might be displayed.
 * @param options.type The type of the current entry.
 *
 * @returns {boolean} `true` if the badge should be displayed, `false` otherwise.
 */
export function shouldDisplay({
  config,
  context,
  depth,
  type,
}: ShouldDisplayOptions) {
  if (type === 'root') {
    return false
  }

  const normalised = normaliseDisplay(config.display)[context]

  return normalised.some((condition) => {
    // When a type is defined, it must always match the type of the HashEntry.
    if (condition.type !== undefined && condition.type !== type) {
      return false
    }
    // When a type is defined...
    if (condition.depth !== undefined && depth !== undefined) {
      // Only match exact depths when asked to.
      if (condition.exactDepth && condition.depth !== depth) {
        return false
      }

      // Or match any depth smaller or equal to the condition.
      if (condition.depth < depth) {
        return false
      }
    }

    // If we haven't been filtered out yet, the HashEntry should be displayed.
    return true
  })
}
