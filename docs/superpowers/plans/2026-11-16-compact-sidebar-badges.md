# Compact Sidebar Badges Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A global `tagBadgesOptions.compactSidebar` option that renders sidebar badges as fixed-width pills, which expand into a floating full badge on hover and keyboard focus.

**Architecture:** The manager reads `tagBadgesOptions` next to `tagBadges`. `Sidebar` computes the entry's badge and the option, then renders a presentational `SidebarLabel`, which lays out the label and badge. In compact mode, `Badge` renders a `CompactBadge`: a fixed-width pill that triggers Storybook's `TooltipProvider`, whose tooltip is the full badge placed over the pill.

**Tech Stack:** React 19, TypeScript, emotion (`storybook/theming/emotion`), `TooltipProvider` from `storybook/internal/components` (react-aria), Vitest (jsdom unit project, Playwright storybook project).

**Spec:** `docs/superpowers/specs/2026-11-16-compact-sidebar-badges-design.md`

## Global Constraints

- Option path: `addons.setConfig({ tagBadgesOptions: { compactSidebar: true } })`; `compactSidebar` defaults to `false` and only affects sidebar badges.
- Badge property: `shortText?: string`, shown by compact pills only; ignored outside compact mode, in the toolbar and in MDX.
- Pill: fixed width `48px`, custom styles can't override it; text centred, one line, ellipsis.
- Floating badge: opens after `200ms` of hover, immediately on keyboard focus; closes immediately; only when the pill doesn't show the full `text`; right edge on the pill's right edge; at most 2 lines; never wider than the distance from the row's left edge to the pill's right edge; never flips; no pointer events; hidden from assistive technologies.
- Pill semantics: `tabIndex={-1}`, `role="img"`, accessible name = full `text`, no `aria-describedby`.
- `renderAriaLabel` output does not change with compact mode.
- README mentions the touch limitation in one line at most.
- Story tests in this container need Chromium at `/opt/pw-browsers/chromium`: run them through a throwaway copy of `vite.config.ts` with `playwright({ launchOptions: { executablePath: '/opt/pw-browsers/chromium' } })`, never committed.

## Review Focus

- A single word wider than the floating badge's maximum width (`badgeofmanyletters` in a narrow row) wraps inside the badge instead of overflowing it. Pinned in Task 2.
- A custom style object that sets `width` or `padding` still yields a 48px pill. Pinned in Task 2.
- `shortText` equal to `text`, or a `text` that fits the pill, opens no floating badge. Pinned in Task 2.
- A row near the viewport's left edge (narrow sidebar, mobile drawer) keeps the floating badge left of the pill's right edge instead of flipping to the right. Pinned in Task 4.
- An entry without a matching badge in compact mode renders its label alone, with no pill. Pinned in Task 3.

---

### Task 1: Options and `shortText` types

**Files:**

- Create: `src/types/TagBadgesOptions.ts`
- Modify: `src/constants.ts`, `src/utils/config.ts`, `src/types/Badge.ts`, `src/manager-helpers.ts`
- Test: `src/__tests__/config.spec.ts`

**Interfaces:**

- Produces: `interface TagBadgesOptions { compactSidebar?: boolean }`; `OPTIONS_KEY = 'tagBadgesOptions'`; `readOptions(config = addons.getConfig()): TagBadgesOptions` (returns `{}` when unset); `Badge.shortText?: string`. `TagBadgesOptions` is exported as a type from `manager-helpers`.

- [ ] **Step 1: Write the failing tests** in `src/__tests__/config.spec.ts`, mocking `storybook/manager-api`'s `addons.getConfig`:

```ts
it('returns no options when none are set', () => {
  expect(readOptions({})).toEqual({})
})
it('returns the options set in tagBadgesOptions', () => {
  expect(readOptions({ tagBadgesOptions: { compactSidebar: true } })).toEqual({
    compactSidebar: true,
  })
})
it('reads the manager config by default', () => {
  // getConfig mocked to return { tagBadgesOptions: { compactSidebar: false } }
  expect(readOptions()).toEqual({ compactSidebar: false })
})
```

- [ ] **Step 2: Run** `pnpm vitest run --project unit src/__tests__/config.spec.ts`. Expected: FAIL, `readOptions` is not exported.
- [ ] **Step 3: Implement** the interfaces above. JSDoc on `compactSidebar` and `shortText` describes the behaviour for editor hints.
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit** `feat: Add compactSidebar option and shortText badge property`.

### Task 2: `CompactBadge`

**Files:**

- Create: `src/components/CompactBadge.tsx`
- Modify: `src/components/Badge.tsx`
- Rename: `src/examples/Badge.stories.ts` → `src/examples/Badge.stories.tsx` (decorators need JSX)
- Test: compact stories with play functions in `src/examples/Badge.stories.tsx`

**Interfaces:**

- Consumes: `Badge.shortText` (Task 1).
- Produces: `COMPACT_BADGE_WIDTH = 48`; `CompactBadge: FC<{ text: string; shortText?: string; extraStyle: CSSObject }>`; `Badge` and `WithBadge` accept `compact?: boolean` and render `CompactBadge` when `context === 'sidebar' && compact`; `getBadgeStyle(style: Badge['style']): CSSObject` (the preset lookup extracted from `Badge`) and `BadgeUI`, both exported from `Badge.tsx`. Test hooks: the pill carries `data-tag-badge="pill"`, the floating badge `data-tag-badge="floating"`.

- [ ] **Step 1: Write the failing stories.** Add a `SidebarRow` decorator mimicking a tree row: an element with `data-item-id`, `width: 260px`, `height: 28px`, `display: flex`, `justify-content: flex-end`, `align-items: center`. Add stories with `context: 'sidebar', compact: true`:
  - `CompactFits` (`text: 'New'`): pill is 48px wide; after hover, `[data-tag-badge="floating"]` never appears.
  - `CompactTruncated` (`text: 'Deprecated'`): pill is 48px wide; after hover, the floating badge shows `Deprecated`, and its right edge equals the pill's (±1px); the pill has role `img`, accessible name `Deprecated`, and no `aria-describedby`.
  - `CompactShortText` (`text: 'Experimental', shortText: 'Exp'`): pill text is `Exp`; after hover, the floating badge shows `Experimental`.
  - `CompactShortTextEqualsText` (`text: 'Beta', shortText: 'Beta'`): no floating badge after hover.
  - `CompactLongText` (`text: 'Multi-word Badge, badgeofmanyletters'`, decorator width `160px`): the floating badge is at most two lines tall (`height <= 2 * 12 + 6 + 1`), its left edge is not left of the row's, and its `scrollWidth <= clientWidth`.
  - `CompactCustomStyle` (`style: { width: 200, padding: '3px 30px', backgroundColor: 'hsl(110, 100%, 64%)' }`, `text: 'Custom'`): pill is 48px wide.
  - `CompactKeyboardFocus` (`text: 'Deprecated'`): after a keyboard event sets keyboard modality (`userEvent.keyboard('{Shift}')`) and `pill.focus()`, the floating badge opens without waiting and has a visible focus ring (`outline-style` is not `none`).

  The preview decorator renders each story twice: play functions target the first copy.

- [ ] **Step 2: Run** the storybook project on `src/examples/Badge.stories.tsx`. Expected: the compact stories FAIL (no pill).
- [ ] **Step 3: Implement `CompactBadge`.**
  - Pill: `BadgeUI` with `width: 48px` applied after `extraStyle`, `overflow: hidden`, `textOverflow: 'ellipsis'`, `whiteSpace: 'nowrap'`, `textAlign: 'center'`, `tabIndex={-1}`, `role="img"`, `aria-label={text}`, showing `shortText ?? text`. It is a component that drops the `aria-describedby` prop `Focusable` merges into it.
  - Trigger: `TooltipProvider` with `placement="left"`, `offset={-COMPACT_BADGE_WIDTH}`, `delayShow={200}`, `delayHide={0}`, controlled through `visible`/`onVisibleChange`. On a request to open, open only if `shortText !== undefined && shortText !== text`, or the pill's `scrollWidth > clientWidth`. Pass `shouldFlip: false` and `style: { outline: 'none', pointerEvents: 'none' }` through `TooltipProvider`'s rest props with a cast, since its props type doesn't declare them.
  - Floating badge: `BadgeUI` with `extraStyle`, `aria-hidden`, `width: 'max-content'`, `maxWidth` measured when opening as the pill's right edge minus the left edge of `pill.closest('[data-item-id], [data-sticky-item-id]')` (or the pill's parent element) minus 4px, `whiteSpace: 'normal'`, `overflowWrap: 'break-word'`, two-line clamp (`display: '-webkit-box'`, `WebkitLineClamp: 2`, `WebkitBoxOrient: 'vertical'`, `overflow: 'hidden'`), and a 2px `theme.color.secondary` outline when the pill matched `:focus-visible` as it opened.
- [ ] **Step 4: Run** the story tests. Expected: PASS, along with the existing Badge stories.
- [ ] **Step 5: Commit** `feat: Render compact sidebar badges with a floating full badge`.

### Task 3: Compact sidebar layout

**Files:**

- Create: `src/components/SidebarLabel.tsx`
- Modify: `src/components/Sidebar.tsx`
- Test: `src/__tests__/renderLabel.spec.tsx`, `src/__tests__/renderAriaLabel.spec.ts`

**Interfaces:**

- Consumes: `readOptions()` (Task 1), `Badge`/`WithBadge` `compact` prop and `data-tag-badge="pill"` (Task 2), `useRowEndAlignment`.
- Produces: `SidebarLabel: FC<{ children: ReactNode; entry: API_HashEntry; badge: { config: BadgeOrBadgeFn; tag: string }; compact: boolean }>`, holding the grid layout and row-end alignment now in `Sidebar`. `Sidebar` keeps its props, computes the first badge and `readOptions().compactSidebar`, and renders `SidebarLabel` (or its children alone when no badge matches).

- [ ] **Step 1: Write the failing tests.** Make the `addons.getConfig` mock return a mutable config, then:

```ts
it('renders a pill when compactSidebar is on', () => {
  config.tagBadgesOptions = { compactSidebar: true }
  render(withTheme(renderLabel(story)))
  expect(
    document.querySelector('[data-tag-badge="pill"]'),
  ).toHaveAccessibleName('New')
})
it('renders a full badge when compactSidebar is off', () => {
  config.tagBadgesOptions = { compactSidebar: false }
  render(withTheme(renderLabel(story)))
  expect(document.querySelector('[data-tag-badge="pill"]')).toBeNull()
  expect(screen.getByText('New')).toBeInTheDocument()
})
it('renders the label alone when no badge matches in compact mode', () => {
  config.tagBadgesOptions = { compactSidebar: true }
  render(withTheme(renderLabel({ ...story, tags: [] } as API_HashEntry)))
  expect(screen.getByText('Primary')).toBeInTheDocument()
  expect(document.querySelector('[data-tag-badge]')).toBeNull()
})
```

In `renderAriaLabel.spec.ts`: with `tagBadgesOptions: { compactSidebar: true }` and a badge with `shortText: 'Dep'`, `renderAriaLabel` still returns `'Primary. Deprecated'`.

- [ ] **Step 2: Run** `pnpm vitest run --project unit src/__tests__`. Expected: the compact tests FAIL.
- [ ] **Step 3: Implement** `SidebarLabel`. In compact mode its grid uses `gridTemplateColumns: 'minmax(0, 1fr) auto'`; otherwise the current `'minmax(0, max-content) minmax(0, max-content)'` with `justifyContent: 'space-between'`.
- [ ] **Step 4: Run** the unit project. Expected: PASS.
- [ ] **Step 5: Commit** `feat: Lay out compact badges in sidebar labels`.

### Task 4: Compact sidebar stories

**Files:**

- Create: `src/examples/CompactSidebar.stories.tsx` (title `Addon/Compact Sidebar`, component `SidebarLabel`)

**Interfaces:**

- Consumes: `SidebarLabel` (Task 3), `data-tag-badge` hooks (Task 2).

- [ ] **Step 1: Write the stories with failing assertions.** A mock sidebar of 28px rows with `data-item-id`, indented by depth, using badges from `defaultConfig`: short and long labels, a selected row (Storybook's selected colours), rows without badges, all in compact mode.
  - `Sidebar` (width 280px): every pill's right edge is 30px from its row's right edge, and every pill is 48px wide.
  - `NarrowSidebar` (width 240px, flush with the viewport's left edge): after hovering the pill of the row with the longest badge text, the floating badge's right edge equals the pill's (±1px) and its left edge is not left of the row's.
- [ ] **Step 2: Run** the storybook project on the file. Expected: PASS once the stories render, since Tasks 2 and 3 provide the behaviour. A failure here is a bug in Task 2 or 3.
- [ ] **Step 3: Commit** `test: Show compact badges in a mock sidebar`.

### Task 5: Documentation and manager check

**Files:**

- Modify: `README.md`

- [ ] **Step 1: Document** in the README:
  - a "Global Options" section introducing `tagBadgesOptions.compactSidebar` with the spec's snippet, the 48px pill, and the floating badge on hover and keyboard focus;
  - `shortText` in the Static Badge Object list and the dynamic badge function section, applying in compact mode only;
  - in "Sidebar Space", a pointer to compact mode;
  - one line: touch screens, which can't hover, only show the pill.
- [ ] **Step 2: Check the manager.** Build the addon, temporarily set `tagBadgesOptions: { compactSidebar: true }` in `.storybook/manager.tsx`, run the Storybook and check with Playwright: hover in normal, sticky and selected rows, keyboard ArrowRight onto a pill, light and dark themes, a narrow sidebar. Revert the temporary setting.
- [ ] **Step 3: Run** `pnpm lint`, `pnpm format`, and the full unit and storybook projects. Expected: all PASS.
- [ ] **Step 4: Commit** `docs: Document compact sidebar badges`.
