import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { API_HashEntry } from 'storybook/internal/types'
import { useTheme } from 'storybook/theming/emotion'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { getBadgeProps } from '../components/Badge'
import { SidebarLabel } from '../components/SidebarLabel'
import { defaultConfig } from '../defaultConfig'
import type { BadgeOrBadgeFn } from '../types/Badge'
import { matchTags } from '../utils/tag'

interface MockRow {
  id: string
  name: string
  depth: number
  tags: string[]
  selected?: boolean
}

const LONG_BADGE = {
  tags: 'very-tight-space',
  badge: { text: 'Multi-word Badge, badgeofmanyletters', style: 'pink' },
} as const

const ROWS: MockRow[] = [
  { id: 'example', name: 'Example', depth: 0, tags: [] },
  { id: 'example-button', name: 'Button', depth: 1, tags: ['version:1.0.0'] },
  { id: 'example-button--primary', name: 'Primary', depth: 2, tags: [] },
  {
    id: 'example-button--medium-size-button',
    name: 'Medium Size Button With A Long Name',
    depth: 2,
    tags: ['deprecated'],
    selected: true,
  },
  { id: 'example-header', name: 'Header', depth: 1, tags: ['new'] },
  { id: 'example-page', name: 'Page', depth: 1, tags: ['experimental'] },
  { id: 'example-release', name: 'Release', depth: 1, tags: ['rc'] },
  {
    id: 'example-tight-space',
    name: 'Tight Space',
    depth: 3,
    tags: ['very-tight-space'],
  },
]

function findBadge(tags: string[]) {
  for (const { badge, tags: patterns } of [LONG_BADGE, ...defaultConfig]) {
    const [tag] = matchTags(tags, patterns)
    if (tag) {
      return { config: badge as BadgeOrBadgeFn, tag }
    }
  }
  return undefined
}

// Mimics a Storybook sidebar row: a fixed-height box, indented by depth,
// whose label box truncates.
function Row({ row }: Readonly<{ row: MockRow }>) {
  const theme = useTheme()
  const badge = findBadge(row.tags)
  const entry = {
    id: row.id,
    name: row.name,
    tags: row.tags,
    type: row.depth === 0 ? 'root' : 'story',
    depth: row.depth,
  } as unknown as API_HashEntry

  return (
    <div
      data-item-id={row.id}
      style={{
        display: 'flex',
        alignItems: 'center',
        height: 28,
        paddingInlineStart: row.depth * 20 + 27,
        paddingInlineEnd: 2,
        borderRadius: 4,
        fontSize: 13,
        background: row.selected ? theme.color.secondary : undefined,
        color: row.selected ? theme.color.lightest : theme.color.defaultText,
        fontWeight: row.selected ? theme.typography.weight.bold : undefined,
      }}
    >
      <span
        style={{
          flex: '1 1 auto',
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {badge ? (
          <SidebarLabel badge={badge} compact entry={entry}>
            {row.name}
          </SidebarLabel>
        ) : (
          row.name
        )}
      </span>
    </div>
  )
}

function MockSidebar({
  rows = ROWS,
  width,
}: Readonly<{ rows?: MockRow[]; width: number }>) {
  const theme = useTheme()
  return (
    <nav
      data-testid="mock-sidebar"
      style={{ width, background: theme.background.app }}
    >
      {rows.map((row) => (
        <Row key={row.id} row={row} />
      ))}
    </nav>
  )
}

const meta: Meta<typeof MockSidebar> = {
  title: 'Addon/Compact Sidebar',
  component: MockSidebar,
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj<typeof MockSidebar>

// The preview decorator renders each story twice; tests use the first copy.
const firstSidebar = (canvasElement: HTMLElement) =>
  within(canvasElement).getAllByTestId('mock-sidebar')[0]

export const Sidebar: Story = {
  args: { width: 280 },
  play: async ({ canvasElement }) => {
    const pills = Array.from(
      firstSidebar(canvasElement).querySelectorAll<HTMLElement>(
        '[data-tag-badge="pill"]',
      ),
    )
    await expect(pills.length).toBe(6)
    await waitFor(() =>
      expect(
        pills.map((pill) =>
          Math.round(
            pill.closest('[data-item-id]')!.getBoundingClientRect().right -
              pill.getBoundingClientRect().right,
          ),
        ),
      ).toEqual(pills.map(() => 30)),
    )
    await expect(
      pills.map((pill) => pill.getBoundingClientRect().width),
    ).toEqual(pills.map(() => 40))
  },
}

export const NarrowSidebar: Story = {
  args: { width: 240 },
}

export const NarrowSidebarHover: Story = {
  ...NarrowSidebar,
  // Hovers a badge to test it; kept out of the sidebar and docs.
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement }) => {
    const row = firstSidebar(canvasElement).querySelector(
      '[data-item-id="example-tight-space"]',
    )!
    const pill = row.querySelector<HTMLElement>('[data-tag-badge="pill"]')!
    await userEvent.hover(row)
    const floating = await waitFor(() => {
      const element = document.querySelector<HTMLElement>(
        '[data-tag-badge="floating"]',
      )
      expect(element).not.toBeNull()
      return element!
    })
    const box = floating.getBoundingClientRect()
    await expect(
      Math.abs(box.right - pill.getBoundingClientRect().right),
    ).toBeLessThanOrEqual(1)
    await expect(box.left).toBeGreaterThanOrEqual(
      row.getBoundingClientRect().left - 0.5,
    )
    await userEvent.unhover(row)
  },
}

// One row per tag of the default config.
const DEFAULT_TAGS = [
  'new',
  'alpha',
  'beta',
  'rc',
  'experimental',
  'deprecated',
  'outdated',
  'danger',
  'code-only',
  'version:1.0.0',
  'v:0.12.3',
  'version:12.4.0-beta.1',
]

export const DefaultBadges: Story = {
  args: {
    width: 280,
    rows: DEFAULT_TAGS.map((tag) => ({
      id: `example-${tag}`,
      name: tag,
      depth: 1,
      tags: [tag],
    })),
  },
  play: async ({ canvasElement }) => {
    const sidebar = firstSidebar(canvasElement)
    await expect(
      sidebar.querySelectorAll('[data-tag-badge="pill"]'),
    ).toHaveLength(DEFAULT_TAGS.length)
    // Every short text of the default badges shows whole in its pill. Badges
    // without one, like versions, show the start of their text.
    const shortTextTags = DEFAULT_TAGS.filter((tag) => {
      const { config } = findBadge([tag])!
      return getBadgeProps(config, undefined, tag, 'sidebar').shortText
    })
    await expect(shortTextTags.length).toBeGreaterThan(0)
    const cutShortTexts = shortTextTags
      .map(
        (tag) =>
          sidebar.querySelector(
            `[data-item-id="example-${tag}"] [data-tag-badge="pill"]`,
          )!.firstElementChild!,
      )
      .filter((text) => text.scrollWidth > text.clientWidth)
      .map((text) => text.textContent)
    await expect(cutShortTexts).toEqual([])
  },
}
