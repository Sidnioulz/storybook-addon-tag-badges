import { API_HashEntry } from 'storybook/internal/types'

/**
 * The type of a Storybook entry, as display conditions name it. Story tests
 * are story entries of the `test` subtype, and are named `test`.
 */
export type DisplayEntryType = API_HashEntry['type'] | 'test'

/**
 * Display options for badges in MDX pages. Only applicable to components
 * and stories referenced in MDX files.
 */
export type MDXDisplayOptionItem =
  boolean | Exclude<API_HashEntry['type'], 'root' | 'group' | 'docs'>
export type MDXDisplayOptions = MDXDisplayOptionItem | MDXDisplayOptionItem[]

/**
 * Display options for badges in the sidebar. Each item in the array must be an object with a
 * skipInherited property to describe inheritance behaviour and an item type.
 */
export type SidebarDisplayOptionItem =
  | boolean
  | {
      skipInherited: boolean
      type: Exclude<DisplayEntryType, 'root'>
    }
export type SidebarDisplayOptions =
  SidebarDisplayOptionItem | SidebarDisplayOptionItem[]

/**
 * Display options for badges in the toolbar. Only applicable to docs, stories
 * and story tests, which have a preview canvas, and thus, a toolbar.
 */
export type ToolbarDisplayOptionItem =
  boolean | Exclude<DisplayEntryType, 'root' | 'component' | 'group'>
export type ToolbarDisplayOptions =
  ToolbarDisplayOptionItem | ToolbarDisplayOptionItem[]

/**
 * The types of HashEntries for which badges will be displayed in different parts of the Storybook UI.
 */
export interface Display {
  /**
   * Controls the display of badges in MDX pages with associated components.
   */
  mdx?: MDXDisplayOptions
  /**
   * Controls the display of badges in the sidebar.
   */
  sidebar?: SidebarDisplayOptions
  /**
   * Controls the display of badges in the toolbar.
   */
  toolbar?: ToolbarDisplayOptions
}

export interface NormalisedDisplay {
  mdx: Exclude<MDXDisplayOptions, boolean>
  sidebar: SidebarDisplayOptions
  toolbar: Exclude<ToolbarDisplayOptions, boolean>
}
