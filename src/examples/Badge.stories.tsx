import React, { type ReactNode, useState } from 'react'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor } from 'storybook/test'

import { Badge } from '../components/Badge'

const meta: Meta<typeof Badge> = {
  title: 'Addon/Badge',
  component: Badge,
  argTypes: {
    style: {
      control: 'select',
      options: [
        'grey',
        'green',
        'turquoise',
        'blue',
        'purple',
        'pink',
        'red',
        'orange',
        'yellow',
      ],
      description:
        'Color preset (a CSS object can also be passed for more customisation)',
    },
    context: {
      control: 'select',
      options: ['sidebar', 'toolbar'],
      description: 'Whether the badge renders in the sidebar or toolbar',
    },
    tooltip: {
      description:
        'Tooltip content; either as string or BadgeTooltipMessage object',
      control: false,
    },
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {
  args: {
    context: 'toolbar',
    text: 'Text',
  },
}

export const Colors: Story = {
  args: {
    context: 'toolbar',
    text: 'Text',
    style: {
      backgroundColor: 'hsl(110, 100%, 64%)',
      color: 'hsl(110, 100%, 8%)',
    },
  },
}

export const ColorAndBorders: Story = {
  args: {
    context: 'toolbar',
    text: 'Text',
    style: {
      backgroundColor: 'hsl(110, 100%, 64%)',
      borderColor: 'hsl(110, 100%, 24%)',
      color: 'hsl(110, 100%, 8%)',
    },
  },
}

export const SimpleTooltip: Story = {
  args: {
    context: 'toolbar',
    text: 'Text',
    tooltip: 'This badge has a simple string tooltip!',
  },
}

export const RichTooltip: Story = {
  args: {
    context: 'toolbar',
    text: 'Text',
    tooltip: {
      title: 'Rich Tooltip',
      desc: 'This badge uses a rich tooltip with title and description',
    },
  },
}

export const RichTooltipWithLink: Story = {
  args: {
    context: 'toolbar',
    text: 'Text',
    tooltip: {
      title: 'Rich Tooltip',
      desc: 'This badge uses a rich tooltip with title and description',
      links: [
        {
          title: 'Storybook',
          href: 'https://storybook.js.org/',
        },
      ],
    },
  },
}

export const SidebarBadge: Story = {
  args: {
    context: 'sidebar',
    text: 'Text',
    tooltip: 'Tooltips are disabled in the sidebar',
  },
}

interface MockRowProps {
  children: ReactNode
  focusable: boolean
  // Whether the row reports keyboard focus, like react-aria's tree rows do
  // with a data-focus-visible attribute.
  reportsFocusVisible: boolean
  style: React.CSSProperties
}

function MockRow({
  children,
  focusable,
  reportsFocusVisible,
  style,
}: Readonly<MockRowProps>) {
  const [isFocusVisible, setIsFocusVisible] = useState(false)
  return (
    <div
      role="treeitem"
      aria-selected={false}
      data-item-id="badge-story"
      data-focus-visible={isFocusVisible || undefined}
      tabIndex={focusable ? 0 : undefined}
      onFocus={(event) =>
        setIsFocusVisible(
          reportsFocusVisible &&
            event.target === event.currentTarget &&
            event.currentTarget.matches(':focus-visible'),
        )
      }
      onBlur={() => setIsFocusVisible(false)}
      style={style}
    >
      {children}
    </div>
  )
}

// Mimics a Storybook sidebar row, whose left edge bounds the floating badge.
const SidebarRow: Decorator = (Story, { parameters }) => (
  <div
    role="tree"
    aria-label="Stories"
    style={
      parameters.scrollable
        ? { height: 60, overflowY: 'auto', position: 'relative' }
        : undefined
    }
  >
    <MockRow
      focusable={parameters.rowFocusable !== false}
      reportsFocusVisible={parameters.rowReportsFocusVisible !== false}
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: parameters.rowWidth ?? 260,
        height: 28,
        ...(parameters.atViewportBottom && {
          position: 'absolute',
          bottom: 2,
        }),
      }}
    >
      <Story />
    </MockRow>
    {parameters.scrollable && <div style={{ height: 200 }} />}
  </div>
)

const deprecatedArgs = {
  context: 'sidebar',
  compact: true,
  text: 'Deprecated',
  style: 'orange',
} satisfies Story['args']

// Stories that hover or focus a badge to test it, kept out of the sidebar and
// docs so that browsing stories never shows their interactions.
const testOnly = ['!dev', '!autodocs']

const getPill = (canvasElement: HTMLElement) =>
  canvasElement.querySelector<HTMLElement>('[data-tag-badge="pill"]')!
const getFloating = () =>
  document.querySelector<HTMLElement>('[data-tag-badge="floating"]')
const expectNoFloatingAfterHover = async (pill: HTMLElement) => {
  await userEvent.hover(pill)
  await new Promise((resolve) => setTimeout(resolve, 500))
  await expect(getFloating()).toBeNull()
  await userEvent.unhover(pill)
}
const waitForFloating = (timeout?: number) =>
  waitFor(
    () => {
      const element = getFloating()
      expect(element).not.toBeNull()
      return element!
    },
    { timeout },
  )
// Resolves once the floating badge has finished opening, so that its
// geometry is settled.
const settled = async (floating: HTMLElement) => {
  await Promise.all(
    floating
      .getAnimations({ subtree: true })
      .map((animation) => animation.finished),
  )
  return floating
}
const hoverUntilFloating = async (pill: HTMLElement) => {
  await userEvent.hover(pill)
  return settled(await waitForFloating())
}

export const CompactFits: Story = {
  decorators: [SidebarRow],
  args: { context: 'sidebar', compact: true, text: 'New', style: 'green' },
  play: async ({ canvasElement }) => {
    const pill = getPill(canvasElement)
    await expect(pill.getBoundingClientRect().width).toBe(40)
    await expectNoFloatingAfterHover(pill)
  },
}

export const CompactTruncated: Story = {
  decorators: [SidebarRow],
  args: deprecatedArgs,
  play: async ({ canvasElement }) => {
    const pill = getPill(canvasElement)
    await expect(pill.getBoundingClientRect().width).toBe(40)
    await expect(pill.closest('[role="treeitem"]')).toHaveAccessibleName(
      'Deprecated',
    )
    await expect(pill).not.toHaveAttribute('tabindex')
    // The text is cut where the pill's padding starts.
    const text = pill.firstElementChild as HTMLElement
    await expect(text.scrollWidth).toBeGreaterThan(text.clientWidth)
    await expect(text.getBoundingClientRect().right).toBeLessThanOrEqual(
      pill.getBoundingClientRect().right -
        Number.parseFloat(getComputedStyle(pill).paddingRight) +
        0.5,
    )
  },
}

export const CompactHoverShowsFullBadge: Story = {
  tags: testOnly,
  decorators: [SidebarRow],
  args: deprecatedArgs,
  play: async ({ canvasElement }) => {
    const pill = getPill(canvasElement)
    // It opens as soon as the pointer enters the pill.
    await userEvent.hover(pill)
    const floating = await settled(await waitForFloating(50))
    await expect(floating).toHaveTextContent('Deprecated')
    const animation = getComputedStyle(floating)
    const duration = Number.parseFloat(animation.animationDuration)
    await expect(duration).toBeGreaterThanOrEqual(0.1)
    await expect(duration).toBeLessThanOrEqual(0.15)
    await expect(animation.animationTimingFunction).toContain('cubic-bezier')
    await expect(
      Math.abs(
        floating.getBoundingClientRect().right -
          pill.getBoundingClientRect().right,
      ),
    ).toBeLessThanOrEqual(1)
    await expect(pill).not.toHaveAttribute('aria-describedby')
    await expect(getComputedStyle(pill).opacity).toBe('0')
    // It stays a moment after the pointer leaves, then closes without an
    // exit animation.
    await userEvent.unhover(pill)
    await new Promise((resolve) => setTimeout(resolve, 80))
    await expect(getFloating()).not.toBeNull()
    await waitFor(() => expect(getFloating()).toBeNull())
    await expect(getComputedStyle(pill).opacity).toBe('1')
  },
}

export const CompactShortText: Story = {
  decorators: [SidebarRow],
  args: {
    context: 'sidebar',
    compact: true,
    text: 'Experimental',
    shortText: 'Exp',
    style: 'purple',
  },
  play: async ({ canvasElement }) => {
    await expect(getPill(canvasElement)).toHaveTextContent('Exp')
  },
}

export const CompactShortTextHover: Story = {
  tags: testOnly,
  decorators: [SidebarRow],
  args: {
    context: 'sidebar',
    compact: true,
    text: 'Experimental',
    shortText: 'Exp',
    style: 'purple',
  },
  play: async ({ canvasElement }) => {
    const pill = getPill(canvasElement)
    const floating = await hoverUntilFloating(pill)
    await expect(floating).toHaveTextContent('Experimental')
    await userEvent.unhover(pill)
  },
}

export const CompactShortTextEqualsText: Story = {
  tags: testOnly,
  decorators: [SidebarRow],
  args: {
    context: 'sidebar',
    compact: true,
    text: 'Beta',
    shortText: 'Beta',
    style: 'purple',
  },
  play: async ({ canvasElement }) => {
    await expectNoFloatingAfterHover(getPill(canvasElement))
  },
}

export const CompactLongText: Story = {
  decorators: [SidebarRow],
  parameters: { rowWidth: 100 },
  args: {
    context: 'sidebar',
    compact: true,
    text: 'Multi-word Badge, badgeofmanyletters',
    style: 'pink',
  },
}

export const CompactLongTextHover: Story = {
  ...CompactLongText,
  tags: testOnly,
  play: async ({ canvasElement }) => {
    const pill = getPill(canvasElement)
    const row = pill.closest('[data-item-id]')!
    const floating = await hoverUntilFloating(pill)
    const box = floating.getBoundingClientRect()
    // The text wraps, and is cut after two lines.
    const text = floating.firstElementChild!
    await expect(text.scrollHeight).toBeGreaterThan(text.clientHeight)
    await expect(box.height).toBeLessThanOrEqual(2 * 12 + 6 + 1)
    await expect(box.left).toBeGreaterThanOrEqual(
      row.getBoundingClientRect().left - 0.5,
    )
    await expect(floating.scrollWidth).toBeLessThanOrEqual(floating.clientWidth)
    await expect(getComputedStyle(floating).textOverflow).toBe('clip')
    await expect(getComputedStyle(floating).webkitLineClamp).toBe('none')
    await userEvent.unhover(pill)
  },
}

export const CompactCustomStyle: Story = {
  decorators: [SidebarRow],
  args: {
    context: 'sidebar',
    compact: true,
    text: 'Custom',
    style: {
      width: 200,
      padding: '3px 30px',
      backgroundColor: 'hsl(110, 100%, 64%)',
    },
  },
  play: async ({ canvasElement }) => {
    await expect(getPill(canvasElement).getBoundingClientRect().width).toBe(40)
  },
}

export const CompactPressCloses: Story = {
  tags: testOnly,
  decorators: [SidebarRow],
  // user-event focuses the row of a pressed pill from a script, which
  // browsers show as keyboard focus. A real press focuses it without that.
  parameters: { rowFocusable: false },
  args: deprecatedArgs,
  play: async ({ canvasElement }) => {
    const pill = getPill(canvasElement)
    await userEvent.hover(pill)
    await new Promise((resolve) => setTimeout(resolve, 50))
    await userEvent.pointer({ keys: '[MouseLeft]', target: pill })
    await new Promise((resolve) => setTimeout(resolve, 400))
    await expect(getFloating()).toBeNull()
    await userEvent.unhover(pill)
  },
}

export const CompactAtViewportEdge: Story = {
  tags: testOnly,
  decorators: [SidebarRow],
  parameters: { atViewportBottom: true },
  args: deprecatedArgs,
  play: async ({ canvasElement }) => {
    const pill = getPill(canvasElement)
    const floating = await hoverUntilFloating(pill)
    const centre = (box: DOMRect) => box.top + box.height / 2
    await expect(
      Math.abs(
        centre(floating.getBoundingClientRect()) -
          centre(pill.getBoundingClientRect()),
      ),
    ).toBeLessThanOrEqual(1)
    await userEvent.unhover(pill)
  },
}

export const CompactUnrollsFromPill: Story = {
  tags: testOnly,
  decorators: [SidebarRow],
  args: {
    context: 'sidebar',
    compact: true,
    text: 'Multi-word Badge',
    style: 'pink',
  },
  play: async ({ canvasElement }) => {
    const pill = getPill(canvasElement)
    await userEvent.hover(pill)
    const floating = await waitForFloating()
    const animations = floating.getAnimations({ subtree: true })
    await expect(animations.length).toBeGreaterThan(0)
    for (const animation of animations) {
      animation.pause()
      animation.currentTime = 0
    }
    // On its first frame, the floating badge shows what the pill shows.
    const text = floating.firstElementChild!.getBoundingClientRect()
    const pillPadding = Number.parseFloat(getComputedStyle(pill).paddingLeft)
    await expect(
      Math.abs(text.left - (pill.getBoundingClientRect().left + pillPadding)),
    ).toBeLessThanOrEqual(1)
    for (const animation of animations) {
      animation.finish()
    }
    await userEvent.unhover(pill)
  },
}

const focusRowWithKeyboard = async (pill: HTMLElement) => {
  const row = pill.closest<HTMLElement>('[data-item-id]')!
  await userEvent.keyboard('{Escape}')
  row.focus()
  return row
}

export const CompactRowFocus: Story = {
  tags: testOnly,
  decorators: [SidebarRow],
  args: deprecatedArgs,
  play: async ({ canvasElement }) => {
    const pill = getPill(canvasElement)
    const row = await focusRowWithKeyboard(pill)
    await waitFor(() => expect(getFloating()).not.toBeNull(), {
      timeout: 50,
    })
    await expect(getComputedStyle(pill).opacity).toBe('0')
    row.blur()
    await waitFor(() => expect(getFloating()).toBeNull(), { timeout: 50 })
  },
}

export const CompactRowFocusFits: Story = {
  tags: testOnly,
  decorators: [SidebarRow],
  args: { context: 'sidebar', compact: true, text: 'New', style: 'green' },
  play: async ({ canvasElement }) => {
    const row = await focusRowWithKeyboard(getPill(canvasElement))
    await new Promise((resolve) => setTimeout(resolve, 100))
    await expect(getFloating()).toBeNull()
    row.blur()
  },
}

export const CompactRowFocusSurvivesHover: Story = {
  tags: testOnly,
  decorators: [SidebarRow],
  args: deprecatedArgs,
  play: async ({ canvasElement }) => {
    const pill = getPill(canvasElement)
    const row = await focusRowWithKeyboard(pill)
    await waitFor(() => expect(getFloating()).not.toBeNull())
    await userEvent.hover(pill)
    await userEvent.unhover(pill)
    await new Promise((resolve) => setTimeout(resolve, 400))
    await expect(getFloating()).not.toBeNull()
    row.blur()
    await waitFor(() => expect(getFloating()).toBeNull())
  },
}

export const CompactRowFocusEscape: Story = {
  tags: testOnly,
  decorators: [SidebarRow],
  args: deprecatedArgs,
  play: async ({ canvasElement }) => {
    const pill = getPill(canvasElement)
    const row = await focusRowWithKeyboard(pill)
    await waitFor(() => expect(getFloating()).not.toBeNull())
    // The key still reaches the sidebar, which closes on Escape on mobile.
    const escapes: KeyboardEvent[] = []
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        escapes.push(event)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    await userEvent.keyboard('{Escape}')
    document.removeEventListener('keydown', onKeyDown)
    await expect(escapes).toHaveLength(1)
    await waitFor(() => expect(getFloating()).toBeNull())
    await expect(document.activeElement).toBe(row)
    await new Promise((resolve) => setTimeout(resolve, 100))
    await expect(getFloating()).toBeNull()
    row.blur()
  },
}

export const CompactRowFocusWithoutKeyboard: Story = {
  tags: testOnly,
  decorators: [SidebarRow],
  // A row focused by a press, which react-aria doesn't report as keyboard
  // focus even when the browser matches :focus-visible.
  parameters: { rowReportsFocusVisible: false },
  args: deprecatedArgs,
  play: async ({ canvasElement }) => {
    const row = await focusRowWithKeyboard(getPill(canvasElement))
    await new Promise((resolve) => setTimeout(resolve, 100))
    await expect(getFloating()).toBeNull()
    row.blur()
  },
}

const nextFrames = () =>
  new Promise((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(resolve)),
  )

export const CompactRowFocusFollowsScroll: Story = {
  tags: testOnly,
  decorators: [SidebarRow],
  parameters: { scrollable: true },
  args: deprecatedArgs,
  play: async ({ canvasElement }) => {
    const pill = getPill(canvasElement)
    const row = await focusRowWithKeyboard(pill)
    const floating = await waitForFloating()
    const scroller = row.closest<HTMLElement>('[role="tree"]')!
    scroller.scrollTop = 20
    await nextFrames()
    const centre = (box: DOMRect) => box.top + box.height / 2
    const pillBox = pill.getBoundingClientRect()
    const floatingBox = floating.getBoundingClientRect()
    await expect(
      Math.abs(floatingBox.right - pillBox.right),
    ).toBeLessThanOrEqual(1)
    await expect(
      Math.abs(centre(floatingBox) - centre(pillBox)),
    ).toBeLessThanOrEqual(1)
    row.blur()
  },
}

export const CompactHoverOverBadge: Story = {
  tags: testOnly,
  decorators: [SidebarRow],
  args: deprecatedArgs,
  play: async ({ canvasElement }) => {
    const pill = getPill(canvasElement)
    const floating = await hoverUntilFloating(pill)
    // The pointer moves onto the part of the badge left of the pill.
    const box = floating.getBoundingClientRect()
    const coords = { clientX: box.left + 4, clientY: box.top + box.height / 2 }
    const target = document.elementFromPoint(coords.clientX, coords.clientY)!
    await userEvent.pointer({ target, coords })
    await new Promise((resolve) => setTimeout(resolve, 400))
    await expect(getFloating()).not.toBeNull()
    // Presses there still reach the row.
    await expect(pill.closest('[data-item-id]')).toContainElement(
      target as HTMLElement,
    )
    await userEvent.unhover(target)
    await waitFor(() => expect(getFloating()).toBeNull())
  },
}
