import React from 'react'
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

// Mimics a Storybook sidebar row, whose left edge bounds the floating badge.
const SidebarRow: Decorator = (Story, { parameters }) => (
  <div
    data-item-id="badge-story"
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
  </div>
)

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
const getVisibleFloating = () => {
  const floating = getFloating()
  return floating && getComputedStyle(floating).opacity !== '0'
    ? floating
    : null
}
const waitForFloating = () =>
  waitFor(() => {
    const element = getFloating()
    expect(element).not.toBeNull()
    return element!
  })
// Resolves once the floating badge has finished opening, so that its
// geometry is settled.
const hoverUntilFloating = async (pill: HTMLElement) => {
  await userEvent.hover(pill)
  const floating = await waitForFloating()
  await Promise.all(
    floating
      .getAnimations({ subtree: true })
      .map((animation) => animation.finished),
  )
  return floating
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
  args: {
    context: 'sidebar',
    compact: true,
    text: 'Deprecated',
    style: 'orange',
  },
  play: async ({ canvasElement }) => {
    const pill = getPill(canvasElement)
    await expect(pill.getBoundingClientRect().width).toBe(40)
    await expect(pill).toHaveAccessibleName('Deprecated')
    // The text is cut where the pill's padding starts.
    const text = pill.firstElementChild as HTMLElement
    await expect(text.scrollWidth).toBeGreaterThan(text.clientWidth)
    await expect(text.getBoundingClientRect().right).toBeLessThanOrEqual(
      pill.getBoundingClientRect().right -
        parseFloat(getComputedStyle(pill).paddingRight) +
        0.5,
    )
  },
}

export const CompactHoverShowsFullBadge: Story = {
  tags: testOnly,
  decorators: [SidebarRow],
  args: {
    context: 'sidebar',
    compact: true,
    text: 'Deprecated',
    style: 'orange',
  },
  play: async ({ canvasElement }) => {
    const pill = getPill(canvasElement)
    const floating = await hoverUntilFloating(pill)
    await expect(floating).toHaveTextContent('Deprecated')
    // The reveal runs alongside a 0s step that keeps the badge hidden during
    // the hover delay.
    const animation = getComputedStyle(floating)
    const durations = animation.animationDuration.split(', ').map(parseFloat)
    await expect(
      durations.some((duration) => duration >= 0.1 && duration <= 0.15),
    ).toBe(true)
    await expect(animation.animationTimingFunction).toContain('cubic-bezier')
    await expect(animation.animationTimingFunction).not.toContain('linear')
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
    await expect(getVisibleFloating()).not.toBeNull()
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

export const CompactKeyboardFocus: Story = {
  tags: testOnly,
  decorators: [SidebarRow],
  args: {
    context: 'sidebar',
    compact: true,
    text: 'Deprecated',
    style: 'orange',
  },
  play: async ({ canvasElement }) => {
    const pill = getPill(canvasElement)
    await userEvent.keyboard('{Escape}')
    pill.focus()
    const floating = await waitFor(
      () => {
        const element = getFloating()
        expect(element).not.toBeNull()
        return element!
      },
      { timeout: 150 },
    )
    await expect(getComputedStyle(floating).opacity).toBe('1')
    await expect(getComputedStyle(floating).outlineStyle).not.toBe('none')
    // The light theme's app background, which keeps the ring visible on the
    // selected row, whose background is the ring's colour.
    await expect(getComputedStyle(floating).boxShadow).toContain(
      'rgb(246, 249, 252)',
    )
    pill.blur()
  },
}

export const CompactPressCloses: Story = {
  tags: testOnly,
  decorators: [SidebarRow],
  args: {
    context: 'sidebar',
    compact: true,
    text: 'Deprecated',
    style: 'orange',
  },
  play: async ({ canvasElement }) => {
    const pill = getPill(canvasElement)
    await userEvent.hover(pill)
    await new Promise((resolve) => setTimeout(resolve, 50))
    await userEvent.pointer({ keys: '[MouseLeft]', target: pill })
    await new Promise((resolve) => setTimeout(resolve, 400))
    await expect(getFloating()).toBeNull()
    await userEvent.unhover(pill)
    pill.blur()
  },
}

export const CompactFitsKeyboardFocus: Story = {
  tags: testOnly,
  decorators: [SidebarRow],
  args: { context: 'sidebar', compact: true, text: 'New', style: 'green' },
  play: async ({ canvasElement }) => {
    const pill = getPill(canvasElement)
    await userEvent.keyboard('{Escape}')
    pill.focus()
    await new Promise((resolve) => setTimeout(resolve, 100))
    await expect(getFloating()).toBeNull()
    // Drawn inside the pill, so that its ancestors can't clip it.
    const { boxShadow } = getComputedStyle(pill)
    await expect(boxShadow).toMatch(
      /^rgb\([^)]+\) 0px 0px 0px 2px inset, rgb\(246, 249, 252\) 0px 0px 0px 3px inset/,
    )
    pill.blur()
  },
}

export const CompactAtViewportEdge: Story = {
  tags: testOnly,
  decorators: [SidebarRow],
  parameters: { atViewportBottom: true },
  args: {
    context: 'sidebar',
    compact: true,
    text: 'Deprecated',
    style: 'orange',
  },
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
      animation.currentTime = Number(animation.effect!.getTiming().delay)
    }
    // On its first frame, the floating badge shows what the pill shows.
    const text = floating.firstElementChild!.getBoundingClientRect()
    const pillPadding = parseFloat(getComputedStyle(pill).paddingLeft)
    await expect(
      Math.abs(text.left - (pill.getBoundingClientRect().left + pillPadding)),
    ).toBeLessThanOrEqual(1)
    for (const animation of animations) {
      animation.finish()
    }
    await userEvent.unhover(pill)
  },
}

export const CompactHoverOpensAtOnce: Story = {
  tags: testOnly,
  decorators: [SidebarRow],
  args: {
    context: 'sidebar',
    compact: true,
    text: 'Deprecated',
    style: 'orange',
  },
  play: async ({ canvasElement }) => {
    const pill = getPill(canvasElement)
    await userEvent.hover(pill)
    await waitFor(() => expect(getVisibleFloating()).not.toBeNull(), {
      timeout: 50,
    })
    await expect(getComputedStyle(pill).opacity).toBe('0')
    await userEvent.unhover(pill)
  },
}

export const CompactHoverKeepsFocus: Story = {
  tags: testOnly,
  decorators: [SidebarRow],
  args: {
    context: 'sidebar',
    compact: true,
    text: 'Deprecated',
    style: 'orange',
  },
  play: async ({ canvasElement }) => {
    const pill = getPill(canvasElement)
    await userEvent.keyboard('{Escape}')
    pill.focus()
    await waitFor(() => expect(getVisibleFloating()).not.toBeNull())
    await userEvent.hover(pill)
    await userEvent.unhover(pill)
    await new Promise((resolve) => setTimeout(resolve, 400))
    await expect(getVisibleFloating()).not.toBeNull()
    pill.blur()
    await waitFor(() => expect(getFloating()).toBeNull())
  },
}
