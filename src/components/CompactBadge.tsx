import React, {
  type FC,
  type RefObject,
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { type CSSObject, srOnlyStyles, styled } from 'storybook/theming/emotion'

import { ROW_SELECTOR } from '../utils/rowEndAlignment'
import { BadgeUI } from './BadgeUI'

/** Width in px of every compact badge, whatever its text. */
const COMPACT_BADGE_WIDTH = 40

const ANIMATION_DURATION = 150
// Decelerates into place, whether the badge opens or closes.
const EASING = 'cubic-bezier(0.2, 0.8, 0.2, 1)'

const PILL_PADDING = 6

// The full badge is drawn over its pill, and follows it as the sidebar
// scrolls, with CSS anchor positioning. Without it, only the pill shows.
const supportsAnchorPositioning =
  typeof CSS !== 'undefined' && !!CSS.supports?.('anchor-name: --tag-badge')

// The box of the floating badge when it covers its pill exactly: what it
// opens from, and closes to.
const COLLAPSED = {
  width: `${COMPACT_BADGE_WIDTH}px`,
  paddingInline: `${PILL_PADDING}px`,
}

const readBox = (badge: HTMLElement): typeof COLLAPSED => {
  const { width, paddingInlineStart } = getComputedStyle(badge)
  return { width, paddingInline: paddingInlineStart }
}

interface Fade {
  to: number
  // The part of the way the badge travels over which the text fades.
  over: [start: number, end: number]
}

// A pill that shows a short text blends it with the text. The text that
// comes in shows in full before the other one starts fading, so that one of
// them always does.
const BLEND: Record<'open' | 'close', { text: Fade; shortText: Fade }> = {
  open: {
    text: { to: 1, over: [0, 0.4] },
    shortText: { to: 0, over: [0.4, 1] },
  },
  close: {
    text: { to: 0, over: [0.6, 1] },
    shortText: { to: 1, over: [0, 0.6] },
  },
}

const fade = (from: string, { to, over: [start, end] }: Fade): Keyframe[] => [
  { opacity: from, offset: 0 },
  { opacity: from, offset: start },
  { opacity: to, offset: end },
  { opacity: to, offset: 1 },
]

interface FloatingBadgeParts {
  badge: HTMLElement
  text: HTMLElement
  shortText: HTMLElement | null
}

// Where the animated parts of a floating badge are, before they have moved
// and then at any time.
const COLLAPSED_PARTS = {
  box: COLLAPSED,
  textOpacity: '0',
  shortTextOpacity: '1',
}

const readParts = ({
  badge,
  text,
  shortText,
}: FloatingBadgeParts): typeof COLLAPSED_PARTS => ({
  box: readBox(badge),
  textOpacity: getComputedStyle(text).opacity,
  shortTextOpacity: shortText ? getComputedStyle(shortText).opacity : '1',
})

/**
 * Opens a floating badge from its pill, or closes it back onto it. The
 * badge's box starts as the pill's and grows, and its text is laid out in it
 * as usual, so that the badge is drawn exactly like the pill when it takes
 * over from it and hands back to it.
 *
 * Opening and closing both start from wherever the previous animations left
 * the badge, as the pointer may come back while it closes.
 */
function animateFloatingBadge(
  parts: FloatingBadgeParts,
  isOpen: boolean,
  previous: Animation[] | null,
): Animation[] {
  const { badge, text, shortText } = parts
  const from = previous ? readParts(parts) : COLLAPSED_PARTS
  previous?.forEach((animation) => animation.cancel())

  // Without animations, the badge is laid out open.
  const open = readBox(badge)
  const to = isOpen ? open : COLLAPSED
  const travel = Number.parseFloat(open.width) - COMPACT_BADGE_WIDTH
  const remaining = Math.abs(
    Number.parseFloat(to.width) - Number.parseFloat(from.box.width),
  )
  const timing: KeyframeAnimationOptions = {
    duration: ANIMATION_DURATION * Math.min(1, remaining / Math.max(1, travel)),
    easing: EASING,
    // Once open, the badge follows its styles again. Once closed, it stays
    // on its pill until it is removed.
    fill: isOpen ? 'none' : 'forwards',
  }
  // The text keeps its size while the badge's box cuts it.
  const size = { width: `${text.getBoundingClientRect().width}px` }
  const animations = [badge.animate([from.box, to], timing)]
  if (!shortText) {
    return [...animations, text.animate([size, size], timing)]
  }
  const blend = isOpen ? BLEND.open : BLEND.close
  return [
    ...animations,
    text.animate(
      fade(from.textOpacity, blend.text).map((keyframe) => ({
        ...keyframe,
        ...size,
      })),
      timing,
    ),
    shortText.animate(fade(from.shortTextOpacity, blend.shortText), timing),
  ]
}

const prefersReducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

// Cuts its text where the badge's padding starts, without an ellipsis, and
// keeps it on one line.
const Cut = styled.span({
  display: 'block',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
})

// One line, like the pill, so that the badge never covers other rows. Text
// that doesn't fit before the row's start ends with an ellipsis.
const FloatingText = styled.span({
  display: 'block',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
})

// The pill's short text, laid out over the pill's area of the floating badge
// the way the pill lays it out.
const FloatingShortText = styled.span({
  position: 'absolute',
  insetBlock: 0,
  right: 0,
  width: COMPACT_BADGE_WIDTH,
  paddingBlock: 'inherit',
  paddingInline: PILL_PADDING,
  boxSizing: 'border-box',
  textAlign: 'center',
  opacity: 0,
})

interface FloatingBadgeProps {
  anchorName: string
  badgeRef: RefObject<HTMLDivElement | null>
  extraStyle: CSSObject
  isOpen: boolean
  maxWidth?: number
  shortText?: string
  shortTextRef: RefObject<HTMLSpanElement | null>
  text: string
  textRef: RefObject<HTMLSpanElement | null>
}

// The full badge, drawn over its pill and expanding to the left of it. Pills
// carry the text for assistive technologies.
const FloatingBadge: FC<FloatingBadgeProps> = ({
  anchorName,
  badgeRef,
  extraStyle,
  isOpen,
  maxWidth,
  shortText,
  shortTextRef,
  text,
  textRef,
}) =>
  createPortal(
    <BadgeUI
      ref={badgeRef}
      aria-hidden
      context="sidebar"
      data-state={isOpen ? 'open' : 'closing'}
      data-tag-badge="floating"
      extraStyle={{
        ...extraStyle,
        boxSizing: 'border-box',
        display: 'block',
        width: 'max-content',
        maxWidth,
        whiteSpace: 'nowrap',
        position: 'fixed',
        zIndex: 100000,
        positionAnchor: anchorName,
        positionVisibility: 'anchors-visible',
        // Its end and top edges are the pill's, so that it covers the pill
        // exactly when it is as small. It takes no transform, which would
        // draw its text differently from the pill's.
        right: 'anchor(right)',
        top: 'anchor(top)',
        // The pointer stays on the row, which keeps its hover styles and
        // receives presses.
        pointerEvents: 'none',
      }}
    >
      <Cut>
        <FloatingText ref={textRef}>{text}</FloatingText>
      </Cut>
      {shortText !== undefined && (
        <FloatingShortText ref={shortTextRef}>
          <Cut>{shortText}</Cut>
        </FloatingShortText>
      )}
    </BadgeUI>,
    document.body,
  )

// Applied after custom styles, so that every pill keeps the same width.
const PILL_STYLE: CSSObject = {
  width: COMPACT_BADGE_WIDTH,
  minWidth: COMPACT_BADGE_WIDTH,
  maxWidth: COMPACT_BADGE_WIDTH,
  paddingInline: PILL_PADDING,
  boxSizing: 'border-box',
  textAlign: 'center',
  whiteSpace: 'nowrap',
}

const HiddenText = styled.span(srOnlyStyles)

interface CompactBadgeProps {
  extraStyle: CSSObject
  shortText?: string
  text: string
}

/**
 * A sidebar badge shown as a fixed-width pill. Hovering its tree row, or
 * focusing the row with the keyboard, shows the full badge over the pill, when
 * the pill doesn't already show all of it.
 */
export const CompactBadge: FC<CompactBadgeProps> = ({
  extraStyle,
  shortText,
  text,
}) => {
  const pillRef = useRef<HTMLDivElement>(null)
  const pillTextRef = useRef<HTMLSpanElement>(null)
  const floatingRef = useRef<HTMLDivElement>(null)
  const floatingTextRef = useRef<HTMLSpanElement>(null)
  const floatingShortTextRef = useRef<HTMLSpanElement>(null)
  const animationsRef = useRef<Animation[] | null>(null)
  const anchorName = `--tag-badge-${useId().replace(/[^\w-]/g, '')}`
  const [isHovered, setIsHovered] = useState(false)
  const [isRowFocused, setIsRowFocused] = useState(false)
  const [maxWidth, setMaxWidth] = useState<number>()
  // The floating badge stays after it closes, until it has shrunk back onto
  // the pill.
  const [isShown, setIsShown] = useState(false)
  const isOpen = isHovered || isRowFocused
  if (isOpen && !isShown) {
    setIsShown(true)
  }

  // Whether the pill hides part of its text. If so, measures the room the
  // floating badge has between the pill and the start of its row.
  const prepareToOpen = useCallback(
    (row: HTMLElement) => {
      const pill = pillRef.current
      const pillText = pillTextRef.current
      if (!pill || !pillText || !supportsAnchorPositioning) {
        return false
      }
      const showsFullText =
        (shortText === undefined || shortText === text) &&
        pillText.scrollWidth <= pillText.clientWidth
      if (showsFullText) {
        return false
      }
      setMaxWidth(
        pill.getBoundingClientRect().right -
          row.getBoundingClientRect().left -
          4,
      )
      return true
    },
    [shortText, text],
  )

  // The badge shows while a mouse is over its tree row, and while the row
  // itself has keyboard focus, which react-aria reports with an attribute.
  // The browser's :focus-visible can also match a row focused by a press
  // after keyboard navigation. Escape hides the badge of a focused row until
  // the row is focused again, and still reaches the sidebar.
  //
  // The listeners are set as soon as the pill is in the DOM, so that a pointer
  // that enters the row right after it renders isn't missed.
  useLayoutEffect(() => {
    const row = pillRef.current?.closest<HTMLElement>(ROW_SELECTOR)
    if (!row) {
      return
    }
    const update = () =>
      setIsRowFocused(
        row.dataset.focusVisible !== undefined && prepareToOpen(row),
      )
    const onPointerEnter = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') {
        setIsHovered(prepareToOpen(row))
      }
    }
    const onPointerLeave = () => setIsHovered(false)
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsRowFocused(false)
      }
    }
    update()
    const observer = new MutationObserver(update)
    observer.observe(row, {
      attributes: true,
      attributeFilter: ['data-focus-visible'],
    })
    row.addEventListener('pointerenter', onPointerEnter)
    row.addEventListener('pointerleave', onPointerLeave)
    row.addEventListener('keydown', onKeyDown)
    return () => {
      observer.disconnect()
      row.removeEventListener('pointerenter', onPointerEnter)
      row.removeEventListener('pointerleave', onPointerLeave)
      row.removeEventListener('keydown', onKeyDown)
    }
  }, [prepareToOpen])

  // Animates the floating badge as it opens and closes, and removes it once
  // it has closed.
  useLayoutEffect(() => {
    const badge = floatingRef.current
    const text = floatingTextRef.current
    if (!isShown || !badge || !text) {
      return
    }
    if (prefersReducedMotion()) {
      if (!isOpen) {
        setIsShown(false)
      }
      return
    }
    const animations = animateFloatingBadge(
      { badge, text, shortText: floatingShortTextRef.current },
      isOpen,
      animationsRef.current,
    )
    animationsRef.current = animations
    if (isOpen) {
      return
    }
    Promise.all(animations.map((animation) => animation.finished)).then(
      () => {
        if (animationsRef.current === animations) {
          animationsRef.current = null
          setIsShown(false)
        }
      },
      // The badge opened again before it had closed.
      () => {},
    )
  }, [isOpen, isShown])

  return (
    <BadgeUI
      ref={pillRef}
      context="sidebar"
      data-tag-badge="pill"
      extraStyle={{
        ...extraStyle,
        ...PILL_STYLE,
        // The floating badge replaces the pill while it shows.
        opacity: isShown ? 0 : 1,
        anchorName: isShown ? anchorName : undefined,
      }}
    >
      <Cut aria-hidden ref={pillTextRef}>
        {shortText ?? text}
      </Cut>
      <HiddenText>{text}</HiddenText>
      {isShown && (
        <FloatingBadge
          anchorName={anchorName}
          badgeRef={floatingRef}
          extraStyle={extraStyle}
          isOpen={isOpen}
          maxWidth={maxWidth}
          // A pill without its own short text shows the start of the text,
          // which unrolls from there.
          shortText={shortText === text ? undefined : shortText}
          shortTextRef={floatingShortTextRef}
          text={text}
          textRef={floatingTextRef}
        />
      )}
    </BadgeUI>
  )
}
