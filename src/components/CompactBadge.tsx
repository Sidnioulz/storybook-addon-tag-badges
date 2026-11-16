import React, {
  type ComponentProps,
  type FC,
  forwardRef,
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
import { BadgeUI, getBadgeBorder } from './BadgeUI'

/** Width in px of every compact badge, whatever its text. */
export const COMPACT_BADGE_WIDTH = 40

// How long the pointer rests on a pill before its floating badge shows. The
// badge opens at once and its animations wait, so that leaving the pill or
// pressing it before then closes a badge that never showed.
const HOVER_DELAY = 150
const ANIMATION_DURATION = 150
// Decelerates into place.
const EASING = 'cubic-bezier(0.2, 0.8, 0.2, 1)'

const PILL_PADDING = 6
// The inline padding of sidebar badges, in BadgeUI.
const BADGE_PADDING = 8

// Holds an element invisible: with `backwards`, until its delay ends; with
// `forwards`, from the end of its delay.
const hidden = keyframes({
  from: { opacity: 0 },
  to: { opacity: 0 },
})

// The floating badge clipped to the pill's area. The pill is 18px tall: a
// two-line badge also grows vertically.
const expand = keyframes({
  from: {
    clipPath: `inset(calc(50% - 9px) 0 calc(50% - 9px) calc(100% - ${COMPACT_BADGE_WIDTH}px) round 999px)`,
  },
  to: { clipPath: 'inset(0 round 999px)' },
})

// The text starts where the pill shows it, and slides into place as the badge
// opens, so that the badge unrolls from the pill rather than replacing it.
const slideIn = keyframes({
  from: {
    transform: `translateX(calc(100% + ${BADGE_PADDING + PILL_PADDING - COMPACT_BADGE_WIDTH}px))`,
  },
  to: { transform: 'none' },
})

const motion = (keyframesName: string, delay: number): CSSObject => ({
  '@media (prefers-reduced-motion: no-preference)': {
    animation: `${keyframesName} ${ANIMATION_DURATION}ms ${EASING} ${delay}ms backwards`,
  },
})

// Cuts the text after two lines, without an ellipsis.
const FloatingText = styled.span<{ delay: number }>(({ delay }) => ({
  display: 'block',
  maxHeight: '1.5rem',
  overflow: 'hidden',
  ...motion(slideIn, delay),
}))

// Applied after custom styles, so that every pill keeps the same width.
const PILL_STYLE: CSSObject = {
  width: COMPACT_BADGE_WIDTH,
  minWidth: COMPACT_BADGE_WIDTH,
  maxWidth: COMPACT_BADGE_WIDTH,
  paddingInline: PILL_PADDING,
  boxSizing: 'border-box',
  overflow: 'hidden',
  textOverflow: 'clip',
  whiteSpace: 'nowrap',
  textAlign: 'center',
}

// Props that TooltipProvider forwards to react-aria without declaring them.
// The floating badge covers the pill: it must let the pointer through to the
// pill, or the pointer would leave the pill and close it. It must stay on the
// pill near the viewport's edges, and never flip to the right of the pill.
const TOOLTIP_PASSTHROUGH_PROPS = {
  containerPadding: 0,
  shouldFlip: false,
  style: { outline: 'none', pointerEvents: 'none' },
} as object

// The pill is named by its own label. The floating badge only repeats it, so
// the pill must not get it as a description.
const Pill = forwardRef<HTMLDivElement, ComponentProps<typeof BadgeUI>>(
  function Pill(props, ref) {
    const pillProps: Record<string, unknown> = { ...props }
    delete pillProps['aria-describedby']
    return <BadgeUI ref={ref} {...(pillProps as typeof props)} />
  },
)

function joinShadows(...shadows: string[]) {
  return shadows.filter((shadow) => shadow !== 'none').join(', ')
}

// react-aria closes tooltips when the pointer leaves their trigger, even
// while the trigger has keyboard focus. Its close request runs within the
// browser's pointer event.
function isPointerLeaving() {
  const type = window.event?.type
  return type === 'pointerout' || type === 'mouseout'
}

interface CompactBadgeProps {
  extraStyle: CSSObject
  shortText?: string
  text: string
}

/**
 * A sidebar badge shown as a fixed-width pill. Hovering or focusing the pill
 * shows the full badge over it, when the pill doesn't already show all of it.
 */
export const CompactBadge: FC<CompactBadgeProps> = ({
  extraStyle,
  shortText,
  text,
}) => {
  const theme = useTheme()
  const pillRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [maxWidth, setMaxWidth] = useState<number>()
  const [hasFocusRing, setHasFocusRing] = useState(false)
  const delay = hasFocusRing ? 0 : HOVER_DELAY

  const onVisibleChange = (visible: boolean) => {
    const pill = pillRef.current
    if (!visible || !pill) {
      // Leaving a pill with the pointer keeps a keyboard user's badge open.
      if (!(isPointerLeaving() && pill?.matches(':focus-visible'))) {
        setIsOpen(false)
      }
      return
    }

    const showsFullText =
      (shortText === undefined || shortText === text) &&
      pill.scrollWidth <= pill.clientWidth
    if (isOpen || showsFullText) {
      return
    }

    const bounds = (pill.closest(ROW_SELECTOR) ?? pill.parentElement)!
    setMaxWidth(
      pill.getBoundingClientRect().right -
        bounds.getBoundingClientRect().left -
        4,
    )
    setHasFocusRing(pill.matches(':focus-visible'))
    setIsOpen(true)
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
    animation: `${hidden} 0s ${delay}ms backwards`,
    '@media (prefers-reduced-motion: no-preference)': {
      animation: `${hidden} 0s ${delay}ms backwards, ${expand} ${ANIMATION_DURATION}ms ${EASING} ${delay}ms backwards`,
    },
    // An inner ring in the app's background keeps the focus ring visible on
    // the selected row, whose background has the focus ring's colour.
    ...(hasFocusRing && {
      boxShadow: joinShadows(
        getBadgeBorder(theme, extraStyle),
        `0 0 0 2px ${theme.background.app}`,
      ),
      outline: `2px solid ${theme.color.secondary}`,
      outlineOffset: 2,
    }),
  }

  return (
    <TooltipProvider
      placement="left"
      offset={-COMPACT_BADGE_WIDTH}
      delayShow={0}
      delayHide={0}
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
          <FloatingText delay={delay}>{text}</FloatingText>
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
          // The floating badge replaces the pill, along with its focus ring,
          // once it shows. Opacity keeps the pill focusable underneath.
          ...(isOpen && { animation: `${hidden} 0s ${delay}ms forwards` }),
          // Drawn inside the pill, which sidebar rows clip, and over the
          // badge's own colour rather than the row's.
          '&:focus-visible': {
            outline: 'none',
            boxShadow: joinShadows(
              `inset 0 0 0 2px ${theme.color.secondary}`,
              `inset 0 0 0 3px ${theme.background.app}`,
              getBadgeBorder(theme, extraStyle),
            ),
          },
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
        {shortText ?? text}
      </Pill>
    </TooltipProvider>
  )
}
