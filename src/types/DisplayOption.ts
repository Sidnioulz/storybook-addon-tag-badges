import { API_HashEntry } from '@storybook/types'

/**
 * Display options for badges in a part of the UI. If `true`, displays for any type of item.
 * If `false`, never displays. If a string or string array, each string is a type of HashEntry
 * for which the badge will be shown (e.g. 'docs' or 'story').
 */
export type DisplayOptionItem<T> =
  | boolean
  | T
  | { skipInherited?: boolean; type: T }
  | { skipInherited: boolean; type?: T }

/**
 * Display options for badges in a part of the UI. If `true`, displays for any type of item.
 * If `false`, never displays. If a string or string array, each string is a type of HashEntry
 * for which the badge will be shown (e.g. 'docs' or 'story').
 */
export type DisplayOption<T> = DisplayOptionItem<T> | DisplayOptionItem<T>[]

/**
 * The types of HashEntries for which badges will be displayed in different parts of the Storybook UI.
 */
export interface Display {
  /**
   * Controls the display of badges in the sidebar.
   */
  sidebar?: DisplayOption<Exclude<API_HashEntry['type'], 'root'>>
  /**
   * Controls the display of badges in the toolbar.
   */
  toolbar?: DisplayOption<
    Exclude<API_HashEntry['type'], 'root' | 'component' | 'group'>
  >
}
