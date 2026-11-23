import React, { type ComponentProps, type ReactNode, useState } from 'react'
import type { Decorator } from '@storybook/react-vite'
import { expect, userEvent, waitFor } from 'storybook/test'

import preview from '../../.storybook/preview'
import { Badge } from '../components/Badge'

const meta = preview.meta({
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
})

export const Default = meta.story({
  args: {
    context: 'toolbar',
    text: 'Text',
  },
})

export const Colors = meta.story({
  args: {
    context: 'toolbar',
    text: 'Text',
    style: {
      backgroundColor: 'hsl(110, 100%, 64%)',
      color: 'hsl(110, 100%, 8%)',
    },
  },
})

export const ColorAndBorders = meta.story({
  args: {
    context: 'toolbar',
    text: 'Text',
    style: {
      backgroundColor: 'hsl(110, 100%, 64%)',
      borderColor: 'hsl(110, 100%, 24%)',
      color: 'hsl(110, 100%, 8%)',
    },
  },
})

export const SimpleTooltip = meta.story({
  args: {
    context: 'toolbar',
    text: 'Text',
    tooltip: 'This badge has a simple string tooltip!',
  },
})

export const RichTooltip = meta.story({
  args: {
    context: 'toolbar',
    text: 'Text',
    tooltip: {
      title: 'Rich Tooltip',
      desc: 'This badge uses a rich tooltip with title and description',
    },
  },
})

export const RichTooltipWithLink = meta.story({
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
})

export const SidebarBadge = meta.story({
  args: {
    context: 'sidebar',
    text: 'Text',
    tooltip: 'Tooltips are disabled in the sidebar',
  },
})

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
} satisfies Partial<ComponentProps<typeof Badge>>

const getPill = (canvasElement: HTMLElement) =>
  canvasElement.querySelector<HTMLElement>('[data-tag-badge="pill"]')!
// The tree row of a pill, which shows its badge while hovered.
const rowOf = (pill: HTMLElement) =>
  pill.closest<HTMLElement>('[data-item-id]')!
const getFloating = () =>
  document.querySelector<HTMLElement>('[data-tag-badge="floating"]')
// The text of the floating badge, inside the box that cuts it.
const textOf = (floating: HTMLElement) =>
  floating.firstElementChild!.firstElementChild as HTMLElement
// The number of lines an element's text is laid out on.
const lineCount = (element: HTMLElement) => {
  const range = document.createRange()
  range.selectNodeContents(element)
  return new Set(
    Array.from(range.getClientRects(), (rect) => Math.round(rect.top)),
  ).size
}
// Freezes animations at a time of their own.
const seek = (animations: Animation[], time: number) => {
  for (const animation of animations) {
    animation.pause()
    animation.currentTime = time
  }
}
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const expectNoFloatingAfterHover = async (pill: HTMLElement) => {
  await userEvent.hover(rowOf(pill))
  await new Promise((resolve) => setTimeout(resolve, 500))
  await expect(getFloating()).toBeNull()
  await userEvent.unhover(rowOf(pill))
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
  await userEvent.hover(rowOf(pill))
  return settled(await waitForFloating())
}

export const CompactFits = meta.story({
  decorators: [SidebarRow],
  args: { context: 'sidebar', compact: true, text: 'New', style: 'green' },
  play: async ({ canvasElement }) => {
    const pill = getPill(canvasElement)
    await expect(pill.getBoundingClientRect().width).toBe(40)
    await expectNoFloatingAfterHover(pill)
  },
})

export const CompactTruncated = meta.story({
  decorators: [SidebarRow],
  args: deprecatedArgs,
  play: async ({ args, canvasElement }) => {
    const pill = getPill(canvasElement)
    await expect(pill.getBoundingClientRect().width).toBe(40)
    await expect(pill.closest('[role="treeitem"]')).toHaveAccessibleName(
      args.text,
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
})

CompactTruncated.test(
  'shows the full badge while its row is hovered',
  async ({ canvasElement }) => {
    const pill = getPill(canvasElement)
    // It opens as soon as the pointer enters the row, anywhere.
    await userEvent.hover(rowOf(pill))
    const floating = await waitForFloating(50)
    const timing = floating.getAnimations()[0].effect!.getTiming()
    await expect(timing.duration).toBeGreaterThanOrEqual(100)
    await expect(timing.duration).toBeLessThanOrEqual(150)
    await expect(timing.easing).toContain('cubic-bezier')
    await settled(floating)
    await expect(floating).toHaveTextContent('Deprecated')
    await expect(
      Math.abs(
        floating.getBoundingClientRect().right -
          pill.getBoundingClientRect().right,
      ),
    ).toBeLessThanOrEqual(1)
    await expect(getComputedStyle(pill).opacity).toBe('0')
    // As soon as the pointer leaves, it shrinks back onto the pill, which
    // shows again once it has.
    await userEvent.unhover(rowOf(pill))
    await waitFor(
      () => expect(floating).toHaveAttribute('data-state', 'closing'),
      { timeout: 50 },
    )
    await waitFor(() => expect(getFloating()).toBeNull())
    await expect(getComputedStyle(pill).opacity).toBe('1')
  },
)

export const CompactShortText = meta.story({
  decorators: [SidebarRow],
  args: {
    context: 'sidebar',
    compact: true,
    text: 'Experimental',
    shortText: 'Exp',
    style: 'purple',
  },
  play: async ({ args, canvasElement }) => {
    await expect(getPill(canvasElement)).toHaveTextContent(args.shortText!)
  },
})

CompactShortText.test(
  'shows the full text while hovered',
  async ({ canvasElement }) => {
    const pill = getPill(canvasElement)
    const floating = await hoverUntilFloating(pill)
    await expect(floating).toHaveTextContent('Experimental')
    await userEvent.unhover(rowOf(pill))
  },
)

CompactShortText.test(
  'shows no floating badge when the short text is the text',
  { args: { text: 'Beta', shortText: 'Beta' } },
  async ({ canvasElement }) => {
    await expectNoFloatingAfterHover(getPill(canvasElement))
  },
)

export const CompactLongText = meta.story({
  decorators: [SidebarRow],
  parameters: { rowWidth: 100 },
  args: {
    context: 'sidebar',
    compact: true,
    text: 'Multi-word Badge, badgeofmanyletters',
    style: 'pink',
  },
})

CompactLongText.test(
  'stays on one line within the row while hovered',
  async ({ canvasElement }) => {
    const pill = getPill(canvasElement)
    const row = pill.closest('[data-item-id]')!
    const floating = await hoverUntilFloating(pill)
    const box = floating.getBoundingClientRect()
    // It stays on one line, and ends with an ellipsis where the row ends.
    const text = textOf(floating)
    await expect(lineCount(text)).toBe(1)
    await expect(box.height).toBe(pill.getBoundingClientRect().height)
    await expect(text.scrollWidth).toBeGreaterThan(text.clientWidth)
    await expect(getComputedStyle(text).textOverflow).toBe('ellipsis')
    await expect(box.left).toBeGreaterThanOrEqual(
      row.getBoundingClientRect().left - 0.5,
    )
    await userEvent.unhover(rowOf(pill))
  },
)

export const CompactCustomStyle = meta.story({
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
})

CompactTruncated.test(
  'stays centred on the pill at the viewport edge',
  { parameters: { atViewportBottom: true } },
  async ({ canvasElement }) => {
    const pill = getPill(canvasElement)
    const floating = await hoverUntilFloating(pill)
    const centre = (box: DOMRect) => box.top + box.height / 2
    await expect(
      Math.abs(
        centre(floating.getBoundingClientRect()) -
          centre(pill.getBoundingClientRect()),
      ),
    ).toBeLessThanOrEqual(1)
    await userEvent.unhover(rowOf(pill))
  },
)

CompactShortText.test(
  'unrolls from the pill',
  { args: { text: 'Multi-word Badge', shortText: 'mwb', style: 'pink' } },
  async ({ canvasElement }) => {
    const pill = getPill(canvasElement)
    await userEvent.hover(rowOf(pill))
    const floating = await waitForFloating()
    const text = textOf(floating)
    const pillText = floating.lastElementChild as HTMLElement
    const animations = floating.getAnimations({ subtree: true })
    await expect(animations.length).toBeGreaterThan(0)
    const opacityOf = (element: HTMLElement) =>
      Number(getComputedStyle(element).opacity)
    // On its first frame, the floating badge shows what the pill shows, and
    // its text starts where the pill's text does.
    seek(animations, 0)
    await expect(pillText).toHaveTextContent('mwb')
    await expect(opacityOf(pillText)).toBe(1)
    await expect(opacityOf(text)).toBe(0)
    const pillPadding = Number.parseFloat(getComputedStyle(pill).paddingLeft)
    await expect(
      Math.abs(
        text.getBoundingClientRect().left -
          (pill.getBoundingClientRect().left + pillPadding),
      ),
    ).toBeLessThanOrEqual(1)
    // The two texts blend, and one of them always shows in full.
    const fullest = [10, 25, 50, 75, 100, 125].map((time) => {
      seek(animations, time)
      return Math.max(opacityOf(text), opacityOf(pillText))
    })
    await expect(fullest).toEqual(fullest.map(() => 1))
    seek(animations, 150)
    await expect(opacityOf(pillText)).toBe(0)
    await expect(opacityOf(text)).toBe(1)
    for (const animation of animations) {
      animation.finish()
    }
    await userEvent.unhover(rowOf(pill))
  },
)

CompactTruncated.test(
  'unrolls the truncated text',
  { args: { text: 'Multi-word Badge', style: 'pink' } },
  async ({ canvasElement }) => {
    const pill = getPill(canvasElement)
    await userEvent.hover(rowOf(pill))
    const floating = await waitForFloating()
    // The pill shows the start of the text: the text itself unrolls from the
    // pill, and stays opaque, with no second text blending in.
    await expect(floating.children).toHaveLength(1)
    const text = textOf(floating)
    const animations = floating.getAnimations({ subtree: true })
    const padding = (element: HTMLElement) =>
      Number.parseFloat(getComputedStyle(element).paddingLeft)
    const frames = [0, 25, 50, 100, 149].map((time) => {
      seek(animations, time)
      return {
        opacity: getComputedStyle(text).opacity,
        // The text never wraps, and sticks to the start of the badge.
        lines: lineCount(text),
        isAtStart:
          Math.abs(
            text.getBoundingClientRect().left -
              (floating.getBoundingClientRect().left + padding(floating)),
          ) <= 0.5,
        // It is laid out and painted like the pill's text: moving or
        // clipping it on its own would draw it differently while the badge
        // animates.
        effects: [floating, text.parentElement!, text].flatMap((element) => {
          const { transform, translate, clipPath } = getComputedStyle(element)
          return [transform, translate, clipPath]
        }),
      }
    })
    await expect(frames).toEqual(
      frames.map(() => ({
        opacity: '1',
        lines: 1,
        isAtStart: true,
        effects: new Array(9).fill('none'),
      })),
    )
    // On its first frame, the badge is the pill: same box, same padding,
    // and the same text cut at the same place.
    seek(animations, 0)
    const pillBox = pill.getBoundingClientRect()
    const box = floating.getBoundingClientRect()
    const cut = text.parentElement!.getBoundingClientRect()
    const pillCut = pill.firstElementChild!.getBoundingClientRect()
    await expect(
      Math.max(
        Math.abs(box.left - pillBox.left),
        Math.abs(box.top - pillBox.top),
        Math.abs(box.width - pillBox.width),
        Math.abs(box.height - pillBox.height),
        Math.abs(cut.left - pillCut.left),
        Math.abs(cut.right - pillCut.right),
      ),
    ).toBeLessThanOrEqual(0.01)
    await expect(padding(floating)).toBe(padding(pill))
    await expect(lineCount(pill.firstElementChild as HTMLElement)).toBe(1)
    for (const animation of animations) {
      animation.finish()
    }
    await userEvent.unhover(rowOf(pill))
  },
)

CompactTruncated.test(
  'slows down into the pill as it closes',
  async ({ canvasElement }) => {
    const pill = getPill(canvasElement)
    const floating = await hoverUntilFloating(pill)
    const openWidth = floating.getBoundingClientRect().width
    await userEvent.unhover(rowOf(pill))
    await waitFor(() =>
      expect(floating).toHaveAttribute('data-state', 'closing'),
    )
    // A quarter into closing, the badge has covered most of the way: it
    // starts moving at once, rather than waiting and snapping shut.
    const [closing] = floating.getAnimations()
    closing.pause()
    closing.currentTime = Number(closing.effect!.getTiming().duration) / 4
    const pillWidth = pill.getBoundingClientRect().width
    await expect(
      floating.getBoundingClientRect().width - pillWidth,
    ).toBeLessThan((openWidth - pillWidth) / 2)
    closing.finish()
    await waitFor(() => expect(getFloating()).toBeNull())
  },
)

// Watches the floating badge on every frame: it only grows while it opens,
// and only shrinks while it closes.
const watchBadgeSize = () => {
  const states = new Set<string>()
  const jumps: string[] = []
  let previous:
    { badge: HTMLElement; state?: string; width: number } | undefined
  let watching = true
  const onFrame = () => {
    const badge = getFloating()
    if (badge) {
      const state = badge.dataset.state
      const { width } = badge.getBoundingClientRect()
      if (state) {
        states.add(state)
      }
      if (previous?.badge === badge && previous.state === state) {
        const change = width - previous.width
        if (
          (state === 'open' && change < -0.5) ||
          (state === 'closing' && change > 0.5)
        ) {
          jumps.push(`${state}: ${previous.width} -> ${width}`)
        }
      }
      previous = { badge, state, width }
    }
    if (watching) {
      requestAnimationFrame(onFrame)
    }
  }
  requestAnimationFrame(onFrame)
  return () => {
    watching = false
    return { jumps, states }
  }
}

CompactTruncated.test(
  'animates from where it is',
  async ({ canvasElement }) => {
    const row = rowOf(getPill(canvasElement))
    const stopWatching = watchBadgeSize()
    // The pointer brushes past the row: the badge closes from wherever it
    // has opened, and never jumps to either end.
    const brushPast = async (inside: number, outside: number) => {
      await userEvent.hover(row)
      await sleep(inside)
      await userEvent.unhover(row)
      await sleep(outside)
    }
    await brushPast(0, 30)
    await brushPast(20, 10)
    await brushPast(60, 0)
    // Once fully open, leaving and coming back keeps it open.
    await userEvent.hover(row)
    await settled(await waitForFloating())
    await userEvent.unhover(row)
    await userEvent.hover(row)
    await sleep(200)
    await userEvent.unhover(row)
    await waitFor(() => expect(getFloating()).toBeNull())
    await expect(stopWatching()).toEqual({
      jumps: [],
      states: new Set(['open', 'closing']),
    })
  },
)

const focusRowWithKeyboard = async (pill: HTMLElement) => {
  const row = pill.closest<HTMLElement>('[data-item-id]')!
  await userEvent.keyboard('{Escape}')
  row.focus()
  return row
}

CompactTruncated.test(
  'shows the full badge while its row has keyboard focus',
  async ({ canvasElement }) => {
    const pill = getPill(canvasElement)
    const row = await focusRowWithKeyboard(pill)
    await waitFor(() => expect(getFloating()).not.toBeNull(), {
      timeout: 50,
    })
    await expect(getComputedStyle(pill).opacity).toBe('0')
    row.blur()
    await waitFor(() => expect(getFloating()).toBeNull())
  },
)

CompactFits.test(
  'shows no floating badge when its row has keyboard focus',
  async ({ canvasElement }) => {
    const row = await focusRowWithKeyboard(getPill(canvasElement))
    await new Promise((resolve) => setTimeout(resolve, 100))
    await expect(getFloating()).toBeNull()
    row.blur()
  },
)

CompactTruncated.test(
  'stays open on keyboard focus after a hover',
  async ({ canvasElement }) => {
    const pill = getPill(canvasElement)
    const row = await focusRowWithKeyboard(pill)
    await waitFor(() => expect(getFloating()).not.toBeNull())
    await userEvent.hover(rowOf(pill))
    await userEvent.unhover(rowOf(pill))
    await new Promise((resolve) => setTimeout(resolve, 400))
    await expect(getFloating()).not.toBeNull()
    row.blur()
    await waitFor(() => expect(getFloating()).toBeNull())
  },
)

CompactTruncated.test(
  'closes on Escape while its row has keyboard focus',
  async ({ canvasElement }) => {
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
)

// A row focused by a press, which react-aria doesn't report as keyboard
// focus even when the browser matches :focus-visible.
CompactTruncated.test(
  'stays closed when its row is focused without a keyboard',
  { parameters: { rowReportsFocusVisible: false } },
  async ({ canvasElement }) => {
    const row = await focusRowWithKeyboard(getPill(canvasElement))
    await new Promise((resolve) => setTimeout(resolve, 100))
    await expect(getFloating()).toBeNull()
    row.blur()
  },
)

const nextFrames = () =>
  new Promise((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(resolve)),
  )

CompactTruncated.test(
  'follows its focused row as it scrolls',
  { parameters: { scrollable: true } },
  async ({ canvasElement }) => {
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
)

CompactTruncated.test(
  'lets the pointer through to its row',
  async ({ canvasElement }) => {
    const pill = getPill(canvasElement)
    const floating = await hoverUntilFloating(pill)
    // The pointer reaches the row under the part of the badge left of the
    // pill, so presses there select the row, and the badge stays.
    const box = floating.getBoundingClientRect()
    const coords = { clientX: box.left + 4, clientY: box.top + box.height / 2 }
    const target = document.elementFromPoint(
      coords.clientX,
      coords.clientY,
    ) as HTMLElement
    await expect(floating).not.toContainElement(target)
    await expect(rowOf(pill)).toContainElement(target)
    await userEvent.pointer({ target, coords })
    await new Promise((resolve) => setTimeout(resolve, 200))
    await expect(getFloating()).toBe(floating)
    await userEvent.unhover(rowOf(pill))
  },
)

CompactTruncated.test('reopens while closing', async ({ canvasElement }) => {
  const pill = getPill(canvasElement)
  const floating = await hoverUntilFloating(pill)
  await userEvent.unhover(rowOf(pill))
  await waitFor(
    () => expect(floating).toHaveAttribute('data-state', 'closing'),
    { timeout: 50 },
  )
  // The pointer comes back before the badge has closed: it unrolls again
  // from where it was, and stays open.
  await userEvent.hover(rowOf(pill))
  await waitFor(() => expect(floating).toHaveAttribute('data-state', 'open'), {
    timeout: 50,
  })
  await new Promise((resolve) => setTimeout(resolve, 300))
  await expect(getFloating()).toBe(floating)
  await userEvent.unhover(rowOf(pill))
  await waitFor(() => expect(getFloating()).toBeNull())
})
