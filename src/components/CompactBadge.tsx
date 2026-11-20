import React, {
  type FC,
  type RefObject,
  useCallback,
  useEffect,
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
// Decelerates as the badge opens. Closing plays it backwards, so that the
// badge speeds up into the pill.
const EASING = 'cubic-bezier(0.2, 0.8, 0.2, 1)'

const PILL_PADDING = 6
// The inline padding of sidebar badges, in BadgeUI.
const BADGE_PADDING = 8

// The full badge is drawn over its pill, and follows it as the sidebar
// scrolls, with CSS anchor positioning. Without it, only the pill shows.
const supportsAnchorPositioning =
  typeof CSS !== 'undefined' && !!CSS.supports?.('anchor-name: --tag-badge')

// The floating badge unrolls from the pill's area. Closing plays it backwards.
const UNROLL: Keyframe[] = [
  {
    clipPath: `inset(0 0 0 calc(100% - ${COMPACT_BADGE_WIDTH}px) round 999px)`,
  },
  { clipPath: 'inset(0 round 999px)' },
]

// The text starts where the pill's text does, and slides into place as the
// badge opens, so that the badge unrolls from the pill rather than replacing
// it. It shows early, while the pill's text fades out late, so that one of
// them always shows in full, also as the badge closes.
const SLIDE_IN: Keyframe[] = [
  {
    transform: `translateX(calc(100% + ${BADGE_PADDING + PILL_PADDING - COMPACT_BADGE_WIDTH}px))`,
    clipPath: `inset(0 calc(100% - ${COMPACT_BADGE_WIDTH - 2 * PILL_PADDING}px) 0 0)`,
    opacity: 0,
  },
  { opacity: 1, offset: 0.4 },
  { transform: 'none', clipPath: 'inset(0)', opacity: 1 },
]
const FADE_OUT: Keyframe[] = [
  { opacity: 1 },
  { opacity: 1, offset: 0.3 },
  { opacity: 0 },
]

const TIMING: KeyframeAnimationOptions = {
  duration: ANIMATION_DURATION,
  easing: EASING,
  fill: 'both',
}

// Plays animations forwards (1) or backwards (-1) from where they are.
// Unlike reverse(), setting the playback rate applies at once. play() would
// restart an animation that already is at the end it plays towards, so it
// finishes there instead.
const playTowards = (animations: Animation[], playbackRate: 1 | -1) => {
  for (const animation of animations) {
    animation.playbackRate = playbackRate
    const time = Number(animation.currentTime)
    const isAtEnd = playbackRate > 0 ? time >= ANIMATION_DURATION : time <= 0
    if (isAtEnd) {
      animation.finish()
    } else {
      animation.play()
    }
  }
}

const prefersReducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

// One line, like the pill, so that the badge never covers other rows. Text
// that doesn't fit before the row's start ends with an ellipsis.
const FloatingText = styled.span({
  display: 'block',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
})

// Cuts the pill's text where its padding starts, without an ellipsis.
const PillText = styled.span({
  display: 'block',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
})

// The pill's text, over the pill's area of the floating badge, which the
// badge fades from as it opens and back to as it closes.
const FloatingPillText = styled(PillText)({
  position: 'absolute',
  top: '50%',
  right: 0,
  width: COMPACT_BADGE_WIDTH,
  paddingInline: PILL_PADDING,
  boxSizing: 'border-box',
  translate: '0 -50%',
  textAlign: 'center',
  opacity: 0,
})

interface FloatingBadgeProps {
  anchorName: string
  badgeRef: RefObject<HTMLDivElement | null>
  extraStyle: CSSObject
  maxWidth?: number
  pillText: string
  pillTextRef: RefObject<HTMLSpanElement | null>
  text: string
  textRef: RefObject<HTMLSpanElement | null>
}

// The full badge, drawn over its pill and expanding to the left of it. Pills
// carry the text for assistive technologies.
const FloatingBadge: FC<FloatingBadgeProps> = ({
  anchorName,
  badgeRef,
  extraStyle,
  maxWidth,
  pillText,
  pillTextRef,
  text,
  textRef,
}) =>
  createPortal(
    <BadgeUI
      ref={badgeRef}
      aria-hidden
      context="sidebar"
      data-tag-badge="floating"
      extraStyle={{
        ...extraStyle,
        display: 'block',
        width: 'max-content',
        maxWidth,
        position: 'fixed',
        zIndex: 100000,
        positionAnchor: anchorName,
        positionVisibility: 'anchors-visible',
        right: 'anchor(right)',
        top: 'anchor(center)',
        translate: '0 -50%',
        // The pointer stays on the row, which keeps its hover styles and
        // receives presses.
        pointerEvents: 'none',
      }}
    >
      <FloatingText ref={textRef}>{text}</FloatingText>
      <FloatingPillText ref={pillTextRef}>{pillText}</FloatingPillText>
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
  const floatingPillTextRef = useRef<HTMLSpanElement>(null)
  const animationsRef = useRef<Animation[]>([])
  const anchorName = `--tag-badge-${useId().replace(/[^\w-]/g, '')}`
  const [isHovered, setIsHovered] = useState(false)
  const [isRowFocused, setIsRowFocused] = useState(false)
  const [maxWidth, setMaxWidth] = useState<number>()
  // The floating badge stays after it closes, until it has rolled back into
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
  useEffect(() => {
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

  // Plays the animations forwards to open the badge, and backwards to close
  // it, from wherever they are, so that the pointer may come back to the pill
  // while the badge closes.
  useLayoutEffect(() => {
    const badge = floatingRef.current
    const badgeText = floatingTextRef.current
    const badgePillText = floatingPillTextRef.current
    if (!isShown || !badge || !badgeText || !badgePillText) {
      return
    }
    const animations = animationsRef.current
    if (isOpen) {
      if (!animations.length && !prefersReducedMotion()) {
        animationsRef.current = [
          badge.animate(UNROLL, TIMING),
          badgeText.animate(SLIDE_IN, TIMING),
          badgePillText.animate(FADE_OUT, TIMING),
        ]
      } else {
        playTowards(animations, 1)
      }
      return
    }
    if (!animations.length) {
      setIsShown(false)
      return
    }
    playTowards(animations, -1)
    Promise.all(animations.map((animation) => animation.finished)).then(
      () => {
        if (animations.every((animation) => animation.playbackRate < 0)) {
          animationsRef.current = []
          setIsShown(false)
        }
      },
      // Ignores animations cancelled before they finish.
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
      <PillText aria-hidden ref={pillTextRef}>
        {shortText ?? text}
      </PillText>
      <HiddenText>{text}</HiddenText>
      {isShown && (
        <FloatingBadge
          anchorName={anchorName}
          badgeRef={floatingRef}
          extraStyle={extraStyle}
          maxWidth={maxWidth}
          pillText={shortText ?? text}
          pillTextRef={floatingPillTextRef}
          text={text}
          textRef={floatingTextRef}
        />
      )}
    </BadgeUI>
  )
}
