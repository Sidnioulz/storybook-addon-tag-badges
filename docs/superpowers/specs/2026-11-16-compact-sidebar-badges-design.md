# Compact sidebar badges

## Intent

Sidebar badges compete with story titles for the width of a sidebar row. Rows have a fixed height, so when both don't fit, both are truncated. Compact mode gives sidebars a cleaner look: every sidebar badge becomes a small pill of one fixed width, story titles get the rest of the row, and the full badge is one hover or focus away.

## Goals

- One global switch turns compact mode on for every sidebar badge.
- In compact mode, every sidebar badge has the same width, so badges form a tidy column and titles get a predictable amount of space.
- The full badge text stays available on hover and on keyboard focus, without opening a menu or leaving the sidebar.
- Badge authors can choose what the compact pill shows, with a short text of their own.

## Non-goals

- Compact toolbar or MDX badges. Both keep showing full badges.
- Per-badge or per-entry compact settings. The switch is global.
- Changes to the sidebar's keyboard model. The tree's existing arrow-key behaviour applies as is.

## Anti-goals

- A sidebar that reads worse with compact mode on: unreadable pills with no way to see the full text, or floating badges that flicker or linger over titles.
- Screen reader users losing information: the full badge text must stay in the row's accessible name, and must not be announced twice when a pill has focus.
- A floating badge that escapes the sidebar row horizontally, or jumps to the other side of the pill.

## Constraints

- Storybook 11 renders sidebar rows at a fixed height of 28px and clips their content. Anything taller than the row, or outside it, has to render in an overlay.
- Rows are virtualized. Sticky copies of rows render in an overlay that is hidden from assistive technologies, and are not reachable with the keyboard.
- The tree follows react-aria's keyboard model. Inside a row, ArrowRight and ArrowLeft move between the row's focusable elements, including elements with `tabIndex={-1}`. On a collapsed branch, ArrowRight expands the branch first.
- Storybook 11 targets Chrome 147+, Edge 150+, Firefox 152+ and Safari 26.5+.
- Badges already align on a fixed distance from the end of the row (`useRowEndAlignment`). Compact pills keep that alignment.

## Approaches

1. **Storybook's `TooltipProvider` (chosen).** The pill is the tooltip trigger, and the full badge is the tooltip content, placed to the left of the pill with a negative offset equal to the pill's width, so that it covers the pill and grows leftwards. It brings hover delays, opening on keyboard focus, closing with Escape or a press elsewhere, viewport-aware positioning and an overlay layer that rows can't clip, and the addon already uses it for toolbar and MDX tooltips. It is an internal Storybook API, the floating badge must not take pointer events or it would cover the trigger and flicker, and react-aria describes the trigger with the tooltip's content, which must not cause a double announcement.
2. **Popover API and CSS anchor positioning.** A top-layer popover pinned to the pill in CSS, which follows scrolling natively. It needs hand-written hover delays, focus handling and dismissal, a unique anchor name per pill, and checks against the browsers with the youngest anchor positioning support.
3. **Portal with measured position.** A fixed-position element rendered in `document.body` from the pill's bounding box. It avoids internal APIs and new CSS features, at the cost of hand-written delays, focus handling, scroll tracking and cleanup.

The `TooltipProvider` approach gives the floating badge the same behaviour as every other Storybook tooltip, for the least code.

## Behaviour

### The `compactSidebar` option

Users turn compact mode on in their manager config:

```ts
// .storybook/manager.ts
import { addons } from 'storybook/manager-api'

addons.setConfig({
  tagBadgesOptions: {
    compactSidebar: true,
  },
})
```

- `tagBadgesOptions` holds the addon's global options. It is separate from `tagBadges`, which lists badges.
- `compactSidebar` is a boolean, `false` by default. It only affects sidebar badges.
- The addon exports a `TagBadgesOptions` type for this object.

### The `shortText` badge property

Badges gain an optional `shortText` string, next to `text`. Static badge objects and dynamic badge functions can both set it.

- In compact mode, the pill shows `shortText` when it is set, and `text` otherwise.
- Outside compact mode, and in the toolbar and MDX, `shortText` is ignored.
- `text` stays required, and remains what the floating badge, the toolbar, MDX and the row's accessible name show.

### The compact pill

- Every pill has the same fixed width, 40px, whatever its text. Its text is centred, on one line, and cut at the pill's edge, without an ellipsis.
- Pills keep the badge's colours and style, including custom styles, except for the fixed width, which custom styles can't override.
- Compact pills also apply in Storybook's mobile drawer, which renders the same tree.
- The label takes all the remaining space of the row, and is truncated with an ellipsis when it doesn't fit. The label and badge no longer split the row evenly.
- Pills stay at the same distance from the end of the row as full-size badges, in sticky rows too.

### The floating badge

- It shows the badge's full `text`, with the badge's colours and style.
- It shows when the pointer rests on the pill for 200ms, and immediately when the pill receives keyboard focus. The delay is part of its animation timing: leaving or pressing the pill before then closes it before it shows. It closes at once, without an exit animation, when the pointer leaves the pill, when the pill loses focus, on Escape and on any pointer press.
- A pill with keyboard focus keeps its badge open when the pointer passes over it and leaves.
- It only opens when the pill doesn't already show the full text: when `shortText` is set, or when `text` is truncated.
- Its right edge sits on the pill's right edge, and it is vertically centred on the pill. It grows leftwards over the label, up to the left edge of the row, and wraps onto a second line when the text is wider than that. Text beyond two lines is cut, without an ellipsis.
- It never flips to the right of the pill, and never extends outside the row horizontally. It may extend above and below the row when it wraps.
- Unless the user prefers reduced motion, it unrolls from the pill towards the left over 120ms with a decelerating curve, its text sliding from where the pill shows it into place. With reduced motion, it shows at once.
- It does not receive pointer events, so that the pointer stays on the pill underneath and clicks reach the row.
- It is drawn above the sidebar, including sticky rows and the context menu button's shadow on the selected row.
- When it opens on keyboard focus, it draws the focus ring, since it covers the focused pill. The ring has an inner ring in the app's background, so that it shows on the selected row, whose background has the focus ring's colour.
- Touch screens can't hover, and a tap selects the row, so touch users only see the pill. This is a documented limitation.

### Keyboard and screen readers

- The pill draws its own focus ring inside its box, in two tones, so that sidebar rows can't clip it.
- The pill has `tabIndex={-1}`. It is not a Tab stop, and the tree's ArrowRight and ArrowLeft reach it like any other focusable element in a row. Pills in sticky copies are therefore never focused.
- The pill has `role="img"` and the badge's full `text` as its accessible name, like Storybook's status icons in the same row.
- The floating badge is hidden from assistive technologies, and the pill does not get the tooltip as its description, so that a focused pill's text is announced once. Removing the description is required: hiding the floating badge alone is not handled consistently across browsers.
- `renderAriaLabel` is unchanged: the row's accessible name includes the badge's full `text`, whether compact mode is on or not.

## Documentation

- README: a section on the global options, introducing `tagBadgesOptions` and `compactSidebar` with the snippet above, the pill's fixed width, and how to read the full text on hover and with the keyboard.
- README: `shortText` in the list of badge properties and in the dynamic badge function examples, stating that it only applies in compact mode.
- README "Sidebar Space" limitation: point to compact mode as the way to keep titles readable in narrow rows.
- README: one line, at most, stating that touch screens only show the pill.
- Types: JSDoc on `TagBadgesOptions.compactSidebar` and `Badge.shortText`, for editor hints.

## Stories

- The badge CSF file (`src/examples/Badge.stories.ts`) gains compact badge stories: a short text that fits, a truncated text, a `shortText`, a long text that wraps onto two lines when expanded, and a custom style.
- A new story file shows compact badges in a sidebar: fixed-height rows with labels of different lengths and depths, a selected row, rows without badges, and a narrow sidebar. It reuses the addon's `Sidebar` layout where the preview allows it, or mimics a Storybook sidebar row otherwise.

## Testing

- Unit tests: reading the options (absent, `false`, `true`); the sidebar label renders a pill only in compact mode; the pill shows `shortText` when set and `text` otherwise; `renderAriaLabel` returns the full text in both modes.
- Play functions on the stories above, in the browser: a compact pill has the fixed width whatever its text; keyboard focus opens the floating badge, whose right edge matches the pill's, with the full text on at most two lines; no floating badge opens when the text fits; the pill's accessible name is the full text and it has no description.
- A check in the addon's own Storybook: hover in normal, sticky and selected rows, light and dark themes, narrow sidebars.

## Left to the builder

- Where the options are read, and how the compact flag reaches the badge component.
- How truncation of `text` in the pill is detected before opening the floating badge.
- How the floating badge's maximum width is computed from the row's left edge, and how flipping is prevented, as `TooltipProvider` does not expose react-aria's `shouldFlip`.
- How to show compact mode in the addon's own Storybook manager, which keeps full-size badges by default.
