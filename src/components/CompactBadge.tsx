import React, {
  type ComponentProps,
  type FC,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { TooltipProvider } from 'storybook/internal/components'
import {
  type CSSObject,
  keyframes,
  styled,
  useTheme,
} from 'storybook/theming/emotion'

import { ROW_SELECTOR } from '../utils/rowEndAlignment'
import { BadgeUI } from './BadgeUI'

/** Width in px of every compact badge, whatever its text. */
export const COMPACT_BADGE_WIDTH = 40

// How long the floating badge stays after the pointer leaves its pill. It then
// disappears without an exit animation: Storybook unmounts tooltips as soon
// as they close.
const EXIT_DELAY = 150
const ANIMATION_DURATION = 150
// Decelerates into place.
const EASING = 'cubic-bezier(0.2, 0.8, 0.2, 1)'

const PILL_PADDING = 6
// The inline padding of sidebar badges, in BadgeUI.
const BADGE_PADDING = 8

// The floating badge clipped to the pill's area. The pill is 18px tall: a
// two-line badge also grows vertically.
const expand = keyframes({
  from: {
    clipPath: `inset(calc(50% - 9px) 0 calc(50% - 9px) calc(100% - ${COMPACT_BADGE_WIDTH}px) round 999px)`,
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

// Cuts the text after two lines, without an ellipsis.
const FloatingText = styled.span({
  display: 'block',
  maxHeight: '1.5rem',
  overflow: 'hidden',
  ...motion(slideIn),
})

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
  textOverflow: 'clip',
})

// Props that TooltipProvider forwards to react-aria without declaring them.
// The floating badge covers the pill: it must let the pointer through to the
// pill, or the pointer would leave the pill and close it. It must stay on the
// pill near the viewport's edges, and never flip to the right of the pill.
const TOOLTIP_PASSTHROUGH_PROPS = {
  containerPadding: 0,
  shouldFlip: false,
  style: { outline: 'none', pointerEvents: 'none' },
} as object

// The pill takes no focus: its tree row does, and shows its badge. The pill
// drops the tab index react-aria gives tooltip triggers, and the description
// pointing to the floating badge, which only repeats the pill's label.
const Pill = forwardRef<HTMLDivElement, ComponentProps<typeof BadgeUI>>(
  function Pill(props, ref) {
    const pillProps: Record<string, unknown> = { ...props }
    delete pillProps['aria-describedby']
    delete pillProps.tabIndex
    return <BadgeUI ref={ref} {...(pillProps as typeof props)} />
  },
)

// Key and pointer presses dismiss the badge from within the browser's event.
// Other closes, such as the pointer leaving the pill, run after a delay.
function isDismissal() {
  const type = window.event?.type
  return type === 'keydown' || type === 'pointerdown' || type === 'mousedown'
}

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
  const theme = useTheme()
  const pillRef = useRef<HTMLDivElement>(null)
  const pillTextRef = useRef<HTMLSpanElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isRowFocused, setIsRowFocused] = useState(false)
  const [maxWidth, setMaxWidth] = useState<number>()
  const isOpen = isHovered || isRowFocused

  // Whether the pill hides part of its text. If so, measures the room the
  // floating badge has to the left of the pill.
  const prepareToOpen = useCallback(() => {
    const pill = pillRef.current
    const pillText = pillTextRef.current
    if (!pill || !pillText) {
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
  // also match a row focused by a press after keyboard navigation.
  useEffect(() => {
    const row = pillRef.current?.closest(ROW_SELECTOR)
    if (!row) {
      return
    }
    const update = () =>
      setIsRowFocused(row.hasAttribute('data-focus-visible') && prepareToOpen())
    update()
    const observer = new MutationObserver(update)
    observer.observe(row, {
      attributes: true,
      attributeFilter: ['data-focus-visible'],
    })
    return () => observer.disconnect()
  }, [prepareToOpen])

  // Reports hovering the pill, and dismissals with Escape or a press, which
  // also hide the badge of a focused row until it is focused again.
  const onVisibleChange = (visible: boolean) => {
    if (visible) {
      setIsHovered(prepareToOpen())
      return
    }
    setIsHovered(false)
    if (isDismissal()) {
      setIsRowFocused(false)
    }
  }

  const floatingStyle: CSSObject = {
    ...extraStyle,
    // A block fills the tooltip's box, which is centred on the pill. An
    // inline block would sit on a line box taller than itself.
    display: 'block',
    width: 'max-content',
    maxWidth,
    whiteSpace: 'normal',
    overflowWrap: 'break-word',
    textOverflow: 'clip',
    ...motion(expand),
  }

  return (
    <TooltipProvider
      placement="left"
      offset={-COMPACT_BADGE_WIDTH}
      delayShow={0}
      delayHide={EXIT_DELAY}
      visible={isOpen}
      onVisibleChange={onVisibleChange}
      tooltip={
        <BadgeUI
          aria-hidden
          context="sidebar"
          data-tag-badge="floating"
          extraStyle={floatingStyle}
          hasLongText={false}
          theme={theme}
        >
          <FloatingText>{text}</FloatingText>
        </BadgeUI>
      }
      {...TOOLTIP_PASSTHROUGH_PROPS}
    >
      <Pill
        ref={pillRef}
        aria-label={text}
        context="sidebar"
        data-tag-badge="pill"
        extraStyle={{
          ...extraStyle,
          ...PILL_STYLE,
          // The floating badge replaces the pill while it shows.
          opacity: isOpen ? 0 : 1,
        }}
        hasLongText={false}
        // react-aria only opens tooltips on hover once a pointer has moved in
        // a document where its input modality listeners run, which a page
        // without other react-aria components never sets up.
        onPointerEnter={(event) => {
          if (event.pointerType === 'mouse') {
            onVisibleChange(true)
          }
        }}
        role="img"
        tabIndex={-1}
        theme={theme}
      >
        <PillText ref={pillTextRef}>{shortText ?? text}</PillText>
      </Pill>
    </TooltipProvider>
  )
}
