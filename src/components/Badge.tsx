import React, { Fragment } from 'react'
import type { HashEntry } from 'storybook/manager-api'
import { WithTooltip, TooltipMessage } from '@storybook/components'
import { CSSObject, styled, useTheme } from 'storybook/theming'

import type { Badge as BadgeConfigType, BadgeOrBadgeFn } from '../types/Badge'
import { getTagParts, getTagPrefix, getTagSuffix } from '../utils/tag'

interface BadgeProps extends BadgeConfigType {
  context: 'sidebar' | 'toolbar'
}

interface WithBadgeProps {
  config: BadgeOrBadgeFn
  entry: HashEntry
  tag: string
  context: 'sidebar' | 'toolbar'
}

const WithTooltipPatched = styled(WithTooltip)`
  line-height: 1px;
`

const BadgeUI = styled.div<
  Pick<BadgeProps, 'context'> & { extraStyle: CSSObject; hasLongText: boolean }
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
  ...extraStyle,
  borderColor: undefined,
}))

const TooltipUI = styled.div(({ theme }) => ({
  padding: '8px 12px',
  boxSizing: 'border-box',
  color: theme.color.defaultText,
  lineHeight: '1.125rem',
}))

export const Badge: React.FC<BadgeProps> = ({
  context,
  style,
  text,
  tooltip,
}) => {
  const theme = useTheme()

  let extraStyle
  if (style === 'green') {
    extraStyle = {
      backgroundColor: 'hsl(130, 100%, 74%)',
      borderColor: 'hsl(130, 100%, 34%)',
      color: 'hsl(130, 100%, 6%)',
    }
  } else if (style === 'purple') {
    extraStyle = {
      backgroundColor: 'hsl(257, 100%, 84%)',
      borderColor: 'hsl(257, 100%, 64%)',
      color: 'hsl(257, 100%, 12%)',
    }
  } else if (style === 'blue') {
    extraStyle = {
      backgroundColor: 'hsl(194, 100%, 74%)',
      borderColor: 'hsl(194, 100%, 34%)',
      color: 'hsl(194, 100%, 12%)',
    }
  } else if (style === 'grey') {
    extraStyle = {
      backgroundColor: 'hsl(0, 0%, 84%)',
      borderColor: 'hsl(0, 0%, 34%)',
      color: 'hsl(0, 0%, 12%)',
    }
  } else if (style === 'orange') {
    extraStyle = {
      backgroundColor: 'hsl(16, 100%, 74%)',
      borderColor: 'hsl(16, 100%, 34%)',
      color: 'hsl(16, 100%, 12%)',
    }
  } else if (style === 'red') {
    extraStyle = {
      backgroundColor: 'hsl(0, 100%, 44%)',
      borderColor: 'hsl(0, 100%, 64%)',
      color: 'hsl(0, 100%, 94%)',
    }
  } else if (style === 'yellow') {
    extraStyle = {
      backgroundColor: 'hsl(36, 100%, 74%)',
      borderColor: 'hsl(36, 100%, 34%)',
      color: 'hsl(36, 100%, 12%)',
    }
  } else if (style === 'pink') {
    extraStyle = {
      backgroundColor: 'hsl(330, 100%, 74%)',
      borderColor: 'hsl(330, 100%, 34%)',
      color: 'hsl(330, 100%, 12%)',
    }
  } else if (style === 'turquoise') {
    extraStyle = {
      backgroundColor: 'hsl(157, 100%, 74%)',
      borderColor: 'hsl(157, 100%, 34%)',
      color: 'hsl(157, 100%, 12%)',
    }
  } else if (typeof style === 'object') {
    extraStyle = {
      ...style,
    }
  }

  const hasLongText = text.length > 15

  return (
    <Fragment>
      {!tooltip || context == 'sidebar' ? (
        <BadgeUI
          context={context}
          extraStyle={extraStyle ?? {}}
          hasLongText={hasLongText}
          theme={theme}
        >
          {text}
        </BadgeUI>
      ) : (
        <WithTooltipPatched
          closeOnOutsideClick
          placement={'bottom'}
          tooltip={
            typeof tooltip === 'string' ? (
              <TooltipUI>{tooltip}</TooltipUI>
            ) : (
              <TooltipMessage {...tooltip} />
            )
          }
        >
          <BadgeUI
            as="button"
            context={context}
            extraStyle={extraStyle ?? {}}
            hasLongText={hasLongText}
            theme={theme}
          >
            {text}
          </BadgeUI>
        </WithTooltipPatched>
      )}
    </Fragment>
  )
}

export function getBadgeProps(
  config: BadgeOrBadgeFn,
  entry: HashEntry,
  tag: string,
): Omit<BadgeProps, 'context'> {
  const props =
    typeof config === 'function'
      ? config({ entry, getTagParts, getTagPrefix, getTagSuffix, tag })
      : config

  return props
}

export const WithBadge: React.FC<WithBadgeProps> = ({
  config,
  entry,
  tag,
  ...restProps
}) => {
  const cfg = getBadgeProps(config, entry, tag)

  return <Badge {...cfg} {...restProps} />
}
