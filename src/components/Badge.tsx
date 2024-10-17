import React, { Fragment } from 'react'
import type { HashEntry } from '@storybook/manager-api'
import { WithTooltip } from '@storybook/components'
import { styled, useTheme } from '@storybook/theming'

import type { BadgeOrBadgeFn } from '../types/Badge'
import { getTagParts, getTagPrefix, getTagSuffix } from '../utils/tag'

interface BadgeProps {
  context: 'sidebar' | 'toolbar'
  /**
   * The content of the Badge
   */
  text: string
  bgColor?: string
  borderColor?: string
  fgColor?: string
  tooltip?: string
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
  Pick<BadgeProps, 'bgColor' | 'borderColor' | 'fgColor' | 'context'>
>(({ as, bgColor, borderColor, fgColor, context, theme }) => ({
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
  background: bgColor ?? theme.color.mediumlight,
  boxShadow:
    theme.base === 'light'
      ? `inset 0 0 0 1px ${borderColor ?? `color-mix(in oklab, ${fgColor ?? theme.color.dark} 10%, transparent 90%)`}`
      : `inset 0 0 0 1px ${borderColor ?? 'none'}`,
  color: fgColor ?? theme.color.dark,
}))

const TooltipUI = styled.div(({ theme }) => ({
  padding: '8px 12px',
  boxSizing: 'border-box',
  color: theme.color.defaultText,
  lineHeight: '1.125rem',
}))

export const Badge: React.FC<BadgeProps> = ({
  context,
  text,
  tooltip,
  ...restProps
}) => {
  const theme = useTheme()

  return (
    <Fragment>
      {!tooltip || context == 'sidebar' ? (
        <BadgeUI {...restProps} context={context} theme={theme}>
          {text}
        </BadgeUI>
      ) : (
        <WithTooltipPatched
          closeOnOutsideClick
          placement={'bottom'}
          tooltip={<TooltipUI>{tooltip}</TooltipUI>}
        >
          <BadgeUI as="button" {...restProps} context={context} theme={theme}>
            {text}
          </BadgeUI>
        </WithTooltipPatched>
      )}
    </Fragment>
  )
}

export const WithBadge: React.FC<WithBadgeProps> = ({
  config,
  entry,
  tag,
  ...restProps
}) => {
  console.log(config, typeof config)

  const cfg =
    typeof config === 'function'
      ? config({ entry, getTagParts, getTagPrefix, getTagSuffix, tag })
      : config

  console.log('badge cfg', tag, cfg)

  return <Badge {...cfg} {...restProps} />
}
