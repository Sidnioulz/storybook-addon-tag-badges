import type { CSSObject } from 'storybook/theming/emotion'
import { styled } from 'storybook/theming/emotion'

import type { Badge } from '../types/Badge'

export type BadgeContext = 'mdx' | 'sidebar' | 'toolbar'

export const BadgeUI = styled.div<
  { context: BadgeContext } & { extraStyle: CSSObject; hasLongText: boolean }
>(({ as, context, extraStyle, hasLongText, theme }) => ({
  display: 'inline-block',
  fontSize: 11,
  lineHeight: '.75rem',
  alignSelf: 'center',
  padding: context === 'sidebar' ? '3px 8px' : '4px 12px',
  border: 'none',
  cursor:
    as === 'button' ? 'help' : context === 'sidebar' ? 'cursor' : 'initial',
  borderRadius: '3em',
  fontWeight: theme.typography.weight.bold,
  boxShadow:
    theme.base === 'light'
      ? `inset 0 0 0 1px ${extraStyle.borderColor ?? `color-mix(in oklab, ${extraStyle.color ?? theme.color.dark} 10%, transparent 90%)`}`
      : `inset 0 0 0 1px ${extraStyle.borderColor ?? 'none'}`,
  backgroundColor: theme.color.mediumlight,
  color: theme.color.dark,
  wordBreak: 'normal',
  width: hasLongText ? 'min-content' : 'fit-content',
  flexShrink: 0,
  textWrapStyle: 'pretty',
  textAlign: 'center',
  // Sidebar rows have a fixed height: the badge stays on one line and
  // truncates when the row is too narrow. It paints above the shadow that
  // Storybook spreads around the context menu button of the selected row.
  ...(context === 'sidebar' && {
    position: 'relative',
    zIndex: 1,
    width: 'auto',
    maxWidth: '100%',
    minWidth: 0,
    justifySelf: 'end',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }),
  ...extraStyle,
  borderColor: undefined,
}))

/**
 * Returns the styles of a badge style preset, or of a custom style object.
 */
export function getBadgeStyle(style: Badge['style']): CSSObject {
  if (style === 'green') {
    return {
      backgroundColor: 'hsl(130, 100%, 74%)',
      borderColor: 'hsl(130, 100%, 34%)',
      color: 'hsl(130, 100%, 6%)',
    }
  } else if (style === 'purple') {
    return {
      backgroundColor: 'hsl(257, 100%, 84%)',
      borderColor: 'hsl(257, 100%, 64%)',
      color: 'hsl(257, 100%, 12%)',
    }
  } else if (style === 'blue') {
    return {
      backgroundColor: 'hsl(194, 100%, 74%)',
      borderColor: 'hsl(194, 100%, 34%)',
      color: 'hsl(194, 100%, 12%)',
    }
  } else if (style === 'grey') {
    return {
      backgroundColor: 'hsl(0, 0%, 84%)',
      borderColor: 'hsl(0, 0%, 34%)',
      color: 'hsl(0, 0%, 12%)',
    }
  } else if (style === 'orange') {
    return {
      backgroundColor: 'hsl(16, 100%, 74%)',
      borderColor: 'hsl(16, 100%, 34%)',
      color: 'hsl(16, 100%, 12%)',
    }
  } else if (style === 'red') {
    return {
      backgroundColor: 'hsl(0, 100%, 44%)',
      borderColor: 'hsl(0, 100%, 64%)',
      color: 'hsl(0, 100%, 94%)',
    }
  } else if (style === 'yellow') {
    return {
      backgroundColor: 'hsl(36, 100%, 74%)',
      borderColor: 'hsl(36, 100%, 34%)',
      color: 'hsl(36, 100%, 12%)',
    }
  } else if (style === 'pink') {
    return {
      backgroundColor: 'hsl(330, 100%, 74%)',
      borderColor: 'hsl(330, 100%, 34%)',
      color: 'hsl(330, 100%, 12%)',
    }
  } else if (style === 'turquoise') {
    return {
      backgroundColor: 'hsl(157, 100%, 74%)',
      borderColor: 'hsl(157, 100%, 34%)',
      color: 'hsl(157, 100%, 12%)',
    }
  } else if (typeof style === 'object') {
    return {
      ...style,
    }
  }

  return {}
}
