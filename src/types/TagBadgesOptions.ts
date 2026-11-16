/**
 * Global options of this addon, set with
 * `addons.setConfig({ tagBadgesOptions: { ... } })` in the manager.
 */
export interface TagBadgesOptions {
  /**
   * Renders every sidebar badge as a small pill of a fixed width, which shows
   * the badge's `shortText`, or the start of its `text`. Hovering or focusing
   * the pill shows the full badge. Defaults to `false`.
   */
  compactSidebar?: boolean
}
