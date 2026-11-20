import React, {
  type FC,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import {
  type CSSObject,
  keyframes,
  srOnlyStyles,
  styled,
} from 'storybook/theming/emotion'

import { ROW_SELECTOR } from '../utils/rowEndAlignment'
import { BadgeUI } from './BadgeUI'

/** Width in px of every compact badge, whatever its text. */
const COMPACT_BADGE_WIDTH = 40

const ANIMATION_DURATION = 150
// Decelerates into place.
const EASING = 'cubic-bezier(0.2, 0.8, 0.2, 1)'

const PILL_PADDING = 6
// The inline padding of sidebar badges, in BadgeUI.
const BADGE_PADDING = 8

// The full badge is drawn over its pill, and follows it as the sidebar
// scrolls, with CSS anchor positioning. Without it, only the pill shows.
const supportsAnchorPositioning =
  typeof CSS !== 'undefined' && !!CSS.supports?.('anchor-name: --tag-badge')

// The floating badge clipped to the pill's area.
const expand = keyframes({
  from: {
    clipPath: `inset(0 0 0 calc(100% - ${COMPACT_BADGE_WIDTH}px) round 999px)`,
  },
  to: { clipPath: 'inset(0 round 999px)' },
})

// The text starts where and as the pill shows it, and slides into place as
// the badge opens, so that the badge unrolls from the pill rather than
// replacing it.
const slideIn = keyframes({
  from: {
    transform: `translateX(calc(100% + ${BADGE_PADDING + PILL_PADDING - COMPACT_BADGE_WIDTH}px))`,
    clipPath: `inset(0 calc(100% - ${COMPACT_BADGE_WIDTH - 2 * PILL_PADDING}px) 0 0)`,
  },
  to: { transform: 'none', clipPath: 'inset(0)' },
})

const motion = (keyframesName: string): CSSObject => ({
  '@media (prefers-reduced-motion: no-preference)': {
    animation: `${keyframesName} ${ANIMATION_DURATION}ms ${EASING}`,
  },
})

// One line, like the pill, so that the badge never covers other rows. Text
// that doesn't fit before the row's start ends with an ellipsis.
const FloatingText = styled.span({
  display: 'block',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  ...motion(slideIn),
})

interface FloatingBadgeProps {
  anchorName: string
  extraStyle: CSSObject
  maxWidth?: number
  text: string
}

// The full badge, drawn over its pill and expanding to the left of it. Pills
// carry the text for assistive technologies.
const FloatingBadge: FC<FloatingBadgeProps> = ({
  anchorName,
  extraStyle,
  maxWidth,
  text,
}) =>
  createPortal(
    <BadgeUI
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
        // The pointer stays on the pill and its row, which keep their hover
        // styles and receive presses.
        pointerEvents: 'none',
        ...motion(expand),
      }}
    >
      <FloatingText>{text}</FloatingText>
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

// Cuts the pill's text where its padding starts, without an ellipsis.
const PillText = styled.span({
  display: 'block',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
})

const HiddenText = styled.span(srOnlyStyles)

interface CompactBadgeProps {
  extraStyle: CSSObject
  shortText?: string
  text: string
}

/**
 * A sidebar badge shown as a fixed-width pill. Hovering the pill, or focusing
 * its tree row with the keyboard, shows the full badge over it, when the pill
 * doesn't already show all of it.
 */
export const CompactBadge: FC<CompactBadgeProps> = ({
  extraStyle,
  shortText,
  text,
}) => {
  const pillRef = useRef<HTMLDivElement>(null)
  const pillTextRef = useRef<HTMLSpanElement>(null)
  const anchorName = `--tag-badge-${useId().replace(/[^\w-]/g, '')}`
  const [isHovered, setIsHovered] = useState(false)
  const [isRowFocused, setIsRowFocused] = useState(false)
  const [maxWidth, setMaxWidth] = useState<number>()
  const isOpen = isHovered || isRowFocused

  // Whether the pill hides part of its text. If so, measures the room the
  // floating badge has to the left of the pill.
  const prepareToOpen = useCallback(() => {
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
    const bounds = (pill.closest(ROW_SELECTOR) ?? pill.parentElement)!
    setMaxWidth(
      pill.getBoundingClientRect().right -
        bounds.getBoundingClientRect().left -
        4,
    )
    return true
  }, [shortText, text])

  // The badge shows while its tree row itself has keyboard focus, which
  // react-aria reports with an attribute. The browser's :focus-visible can
  // also match a row focused by a press after keyboard navigation. Escape
  // hides it until the row is focused again, and still reaches the sidebar.
  useEffect(() => {
    const row = pillRef.current?.closest<HTMLElement>(ROW_SELECTOR)
    if (!row) {
      return
    }
    const update = () =>
      setIsRowFocused(row.dataset.focusVisible !== undefined && prepareToOpen())
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
    row.addEventListener('keydown', onKeyDown)
    return () => {
      observer.disconnect()
      row.removeEventListener('keydown', onKeyDown)
    }
  }, [prepareToOpen])

  return (
    <BadgeUI
      ref={pillRef}
      context="sidebar"
      data-tag-badge="pill"
      extraStyle={{
        ...extraStyle,
        ...PILL_STYLE,
        // The floating badge replaces the pill while it shows.
        opacity: isOpen ? 0 : 1,
        anchorName: isOpen ? anchorName : undefined,
      }}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') {
          setIsHovered(prepareToOpen())
        }
      }}
      onPointerLeave={() => setIsHovered(false)}
    >
      <PillText aria-hidden ref={pillTextRef}>
        {shortText ?? text}
      </PillText>
      <HiddenText>{text}</HiddenText>
      {isOpen && (
        <FloatingBadge
          anchorName={anchorName}
          extraStyle={extraStyle}
          maxWidth={maxWidth}
          text={text}
        />
      )}
    </BadgeUI>
  )
}
