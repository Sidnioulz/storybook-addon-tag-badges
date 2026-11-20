/**
 * Global options of this addon, set with
 * `addons.setConfig({ tagBadgesOptions: { ... } })` in the manager.
 */
export interface TagBadgesOptions {
  /**
   * Renders every sidebar badge as a small pill of a fixed width, which shows
   * the badge's `shortText`, or the start of its `text`. Hovering the pill, or
   * focusing its row with the keyboard, shows the whole badge over it, on one
   * line that ends with an ellipsis if the row is too narrow. Defaults to
   * `false`.
   */
  compactSidebar?: boolean
}
