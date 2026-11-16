import React, {
  type ComponentProps,
  type FC,
  type PointerEvent,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from 'react'
import { TooltipProvider } from 'storybook/internal/components'
import { type CSSObject, useTheme } from 'storybook/theming/emotion'

import { ROW_SELECTOR } from '../utils/rowEndAlignment'
import { BadgeUI, getBadgeBorder } from './BadgeUI'

/** Width in px of every compact badge, whatever its text. */
export const COMPACT_BADGE_WIDTH = 48

const HOVER_DELAY = 200

// Applied after custom styles, so that every pill keeps the same width.
const PILL_STYLE: CSSObject = {
  width: COMPACT_BADGE_WIDTH,
  minWidth: COMPACT_BADGE_WIDTH,
  maxWidth: COMPACT_BADGE_WIDTH,
  paddingInline: 6,
  boxSizing: 'border-box',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
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

  const hoverTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(hoverTimer.current), [])

  const onVisibleChange = (visible: boolean) => {
    const pill = pillRef.current
    if (!visible || !pill) {
      clearTimeout(hoverTimer.current)
      setIsOpen(false)
      return
    }

    const showsFullText =
      (shortText === undefined || shortText === text) &&
      pill.scrollWidth <= pill.clientWidth
    if (showsFullText) {
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

  // react-aria only opens tooltips on hover once a pointer has moved in a
  // document where its input modality listeners run, which a page without
  // other react-aria components never sets up. The pill handles mouse hover
  // itself, and leaves focus and dismissal to react-aria.
  const onPointerEnter = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') {
      return
    }
    clearTimeout(hoverTimer.current)
    hoverTimer.current = setTimeout(() => onVisibleChange(true), HOVER_DELAY)
  }
  const onPointerLeave = () => {
    clearTimeout(hoverTimer.current)
    if (document.activeElement !== pillRef.current) {
      onVisibleChange(false)
    }
  }

  const floatingStyle: CSSObject = {
    ...extraStyle,
    width: 'max-content',
    maxWidth,
    whiteSpace: 'normal',
    overflowWrap: 'break-word',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
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
      delayShow={HOVER_DELAY}
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
          {text}
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
          // The floating badge replaces the pill while it shows, along with
          // its focus ring. Opacity keeps the pill focusable underneath.
          opacity: isOpen ? 0 : 1,
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
        onPointerDown={() => clearTimeout(hoverTimer.current)}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        role="img"
        tabIndex={-1}
        theme={theme}
      >
        {shortText ?? text}
      </Pill>
    </TooltipProvider>
  )
}
