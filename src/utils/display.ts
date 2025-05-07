import { HashEntry } from 'storybook/manager-api'
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
  context: 'mdx' | 'sidebar' | 'toolbar'
  type: HashEntry['type']
}

type NormalisedDisplayOption =
  | {
      skipInherited?: boolean
      type: API_HashEntry['type']
    }
  | {
      skipInherited: boolean
      type?: API_HashEntry['type']
    }

type NormalisedDisplayOptions = NormalisedDisplayOption[]

export const DISPLAY_DEFAULTS = {
  mdx: [{ type: 'story' }, { type: 'component' }],
  sidebar: [
    { skipInherited: true },
    { type: 'component', skipInherited: false },
    { type: 'group', skipInherited: false },
  ],
  toolbar: [{ type: 'docs' }, { type: 'story' }],
} satisfies {
  mdx: NormalisedDisplayOptions
  sidebar: NormalisedDisplayOptions
  toolbar: NormalisedDisplayOptions
}

function normaliseDisplayProperty(
  value: DisplayOption<API_HashEntry['type']> | undefined,
  defaultValue: NormalisedDisplayOptions,
): NormalisedDisplayOptions {
  if (value === undefined) {
    return [...defaultValue]
  }

  const toNormalise = (
    Array.isArray(value) ? value : [value]
  ) satisfies DisplayOptionItem<API_HashEntry['type']>[]

  return toNormalise
    .map((prop) => {
      if (typeof prop === 'boolean') {
        return prop ? [{ skipInherited: false }] : []
      } else if (typeof prop === 'string') {
        return [{ type: prop }]
      }
      return prop
    })
    .flat()
}

export function normaliseDisplay(display?: Display): {
  mdx: NormalisedDisplayOptions
  sidebar: NormalisedDisplayOptions
  toolbar: NormalisedDisplayOptions
} {
  return {
    mdx: normaliseDisplayProperty(display?.mdx, DISPLAY_DEFAULTS.mdx),
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

  const normalised = normaliseDisplay(config.display)[context]
  let outcome = DisplayOutcome.NEVER

  for (const condition of normalised) {
    // When a type is defined, it must always match the type of the HashEntry.
    // If it doesn't, we don't return true yet.
    if (condition.type !== undefined && condition.type !== type) {
      continue
    }

    // By default, we hide badges for tags that are already displayed
    // by a parent entry in the sidebar. This option does nothing in
    // the toolbar context.
    if (context === 'sidebar' && condition.skipInherited !== false) {
      outcome = DisplayOutcome.SKIP_INHERITED
      continue
    }

    // If we reach this, the HashEntry should be displayed unconditionally.
    // Return early as there is no point in iterating further.
    outcome = DisplayOutcome.ALWAYS
    break
  }

  return outcome
}
