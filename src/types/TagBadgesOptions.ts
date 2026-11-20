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
}
