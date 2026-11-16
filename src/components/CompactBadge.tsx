import React, {
  type ComponentProps,
  type FC,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { TooltipProvider } from 'storybook/internal/components'
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

// The badge of a focused row follows its pill as the sidebar scrolls, which
// takes CSS anchor positioning. Without it, only hovering shows the badge.
const supportsAnchorPositioning =
  typeof CSS !== 'undefined' &&
  !!CSS.supports?.('anchor-name: --tag-badge') &&
  !!CSS.supports?.('position-visibility: anchors-visible')

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

interface FloatingBadgeProps {
  extraStyle: CSSObject
  maxWidth?: number
  text: string
}

// The full badge, drawn over its pill and expanding to the left of it. Pills
// carry the text for assistive technologies.
const FloatingBadge = forwardRef<HTMLDivElement, FloatingBadgeProps>(
  function FloatingBadge({ extraStyle, maxWidth, text }, ref) {
    return (
      <BadgeUI
        ref={ref}
        aria-hidden
        context="sidebar"
        data-tag-badge="floating"
        extraStyle={{
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
        }}
      >
        <FloatingText>{text}</FloatingText>
      </BadgeUI>
    )
  },
)

// Applied after custom styles, so that every pill keeps the same width.
const PILL_STYLE: CSSObject = {
  width: COMPACT_BADGE_WIDTH,
  minWidth: COMPACT_BADGE_WIDTH,
  maxWidth: COMPACT_BADGE_WIDTH,
  paddingInline: PILL_PADDING,
  boxSizing: 'border-box',
  textAlign: 'center',
  // Lets the hover area extend past the pill. The text clips itself.
  overflow: 'visible',
}

// Cuts the pill's text where its padding starts, without an ellipsis.
const PillText = styled.span({
  display: 'block',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
})

const HiddenText = styled.span(srOnlyStyles)

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
// pointing to the floating badge, which only repeats the pill's text.
const Pill = forwardRef<HTMLDivElement, ComponentProps<typeof BadgeUI>>(
  function Pill(props, ref) {
    const pillProps: Record<string, unknown> = { ...props }
    delete pillProps['aria-describedby']
    delete pillProps.tabIndex
    return <BadgeUI ref={ref} {...(pillProps as typeof props)} />
  },
)

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
  const [hoverArea, setHoverArea] = useState<{
    width: number
    height: number
  }>()

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
  // also match a row focused by a press after keyboard navigation. Escape
  // hides it until the row is focused again, and still reaches the sidebar.
  useEffect(() => {
    const row = pillRef.current?.closest<HTMLElement>(ROW_SELECTOR)
    if (!row || !supportsAnchorPositioning) {
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

  const onVisibleChange = useCallback(
    (visible: boolean) => setIsHovered(visible && prepareToOpen()),
    [prepareToOpen],
  )

  const measureHoverArea = useCallback((badge: HTMLDivElement | null) => {
    if (badge) {
      setHoverArea({ width: badge.offsetWidth, height: badge.offsetHeight })
    }
  }, [])

  return (
    <>
      <TooltipProvider
        placement="left"
        offset={-COMPACT_BADGE_WIDTH}
        delayShow={0}
        delayHide={EXIT_DELAY}
        // The badge of a focused row replaces the one shown on hover.
        disabled={isRowFocused}
        visible={isHovered}
        onVisibleChange={onVisibleChange}
        tooltip={
          <FloatingBadge
            ref={measureHoverArea}
            extraStyle={extraStyle}
            maxWidth={maxWidth}
            text={text}
          />
        }
        {...TOOLTIP_PASSTHROUGH_PROPS}
      >
        <Pill
          ref={pillRef}
          context="sidebar"
          data-tag-badge="pill"
          extraStyle={{
            ...extraStyle,
            ...PILL_STYLE,
            // The floating badge replaces the pill while it shows.
            opacity: isHovered || isRowFocused ? 0 : 1,
            anchorName: isRowFocused ? anchorName : undefined,
            // While the badge shows on hover, the pill's area grows to match
            // it, so that the pointer can move over the badge and presses
            // there still reach the row. The row's label clips this area.
            ...(isHovered &&
              hoverArea && {
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  right: 0,
                  top: '50%',
                  translate: '0 -50%',
                  ...hoverArea,
                },
              }),
          }}
          // react-aria only opens tooltips on hover once a pointer has moved
          // in a document where its input modality listeners run, which a
          // page without other react-aria components never sets up.
          onPointerEnter={(event) => {
            if (event.pointerType === 'mouse' && !isRowFocused) {
              onVisibleChange(true)
            }
          }}
        >
          <PillText aria-hidden ref={pillTextRef}>
            {shortText ?? text}
          </PillText>
          <HiddenText>{text}</HiddenText>
        </Pill>
      </TooltipProvider>
      {isRowFocused &&
        createPortal(
          <FloatingBadge
            extraStyle={{
              ...extraStyle,
              position: 'fixed',
              zIndex: 100000,
              positionAnchor: anchorName,
              positionVisibility: 'anchors-visible',
              right: 'anchor(right)',
              top: 'anchor(center)',
              translate: '0 -50%',
              pointerEvents: 'none',
            }}
            maxWidth={maxWidth}
            text={text}
          />,
          document.body,
        )}
    </>
  )
}
