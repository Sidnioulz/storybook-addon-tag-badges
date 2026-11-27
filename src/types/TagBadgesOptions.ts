/**
 * Global options of this addon, set with
 * `addons.setConfig({ tagBadgesOptions: { ... } })` in the manager.
 */
export interface TagBadgesOptions {
  /**
   * Renders every sidebar badge as a small pill of a fixed width, which shows
   * the badge's `shortText`, or the start of its `text`. Hovering a row, or
   * focusing it with the keyboard, shows its whole badge over the pill, on one
   * line that ends with an ellipsis if the row is too narrow. Defaults to
   * `false`.
   */
  compactSidebar?: boolean

  /**
   * Gives component and group entries the tags that all the docs, story and
   * test entries below them have in common, instead of the tags Storybook
   * gives them. A component or group then only shows a sidebar badge when
   * every entry below it has the badge's tag, whether or not sidebar filters
   * hide some of these entries. Defaults to `false`.
   */
  legacyTagIntersection?: boolean
}
