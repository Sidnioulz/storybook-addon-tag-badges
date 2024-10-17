import { ArrayElement } from '../types/ArrayElement'
import { TagBadgeParameters } from '../types/TagBadgeParameters'
import { HashEntry } from '@storybook/manager-api'
import { ItemType } from 'src/types/itemType'
import { Display } from 'src/types/DisplayOption'

export interface ShouldDisplayOptions {
  config: Partial<ArrayElement<TagBadgeParameters>>
  context: 'sidebar' | 'toolbar'
  type: HashEntry['type']
}

export const DISPLAY_DEFAULTS = {
  sidebar: ['component'],
  toolbar: ['component', 'docs', 'story'],
} satisfies Display

function normaliseDisplayProperty(
  value: boolean | ItemType | ItemType[] | undefined,
  defaultValue: ItemType[],
): ItemType[] {
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
  sidebar: ItemType[]
  toolbar: ItemType[]
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
 * TODO doc
 */
export function shouldDisplay({ config, context, type }: ShouldDisplayOptions) {
  if (type === 'root') {
    return false
  }

  return normaliseDisplay(config.display)[context].includes(type)
}
