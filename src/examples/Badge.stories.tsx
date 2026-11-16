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
    }}
  >
    <Story />
  </div>
)

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
const hoverUntilFloating = async (pill: HTMLElement) => {
  await userEvent.hover(pill)
  return waitFor(() => {
    const floating = getFloating()
    expect(floating).not.toBeNull()
    return floating!
  })
}

export const CompactFits: Story = {
  decorators: [SidebarRow],
  args: { context: 'sidebar', compact: true, text: 'New', style: 'green' },
  play: async ({ canvasElement }) => {
    const pill = getPill(canvasElement)
    await expect(pill.getBoundingClientRect().width).toBe(48)
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
    await expect(pill.getBoundingClientRect().width).toBe(48)
    await expect(pill).toHaveAttribute('role', 'img')
    await expect(pill).toHaveAccessibleName('Deprecated')

    const floating = await hoverUntilFloating(pill)
    await expect(floating).toHaveTextContent('Deprecated')
    await expect(
      Math.abs(
        floating.getBoundingClientRect().right -
          pill.getBoundingClientRect().right,
      ),
    ).toBeLessThanOrEqual(1)
    await expect(pill).not.toHaveAttribute('aria-describedby')
    await userEvent.unhover(pill)
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
    const pill = getPill(canvasElement)
    await expect(pill).toHaveTextContent('Exp')
    const floating = await hoverUntilFloating(pill)
    await expect(floating).toHaveTextContent('Experimental')
    await userEvent.unhover(pill)
  },
}

export const CompactShortTextEqualsText: Story = {
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
  parameters: { rowWidth: 160 },
  args: {
    context: 'sidebar',
    compact: true,
    text: 'Multi-word Badge, badgeofmanyletters',
    style: 'pink',
  },
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
    await expect(getPill(canvasElement).getBoundingClientRect().width).toBe(48)
  },
}

export const CompactKeyboardFocus: Story = {
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
    await expect(getComputedStyle(floating).outlineStyle).not.toBe('none')
    pill.blur()
  },
}
