import React, { Fragment } from 'react'
import type { HashEntry } from '@storybook/manager-api'
import { WithTooltip } from '@storybook/components'
import { styled, useTheme } from '@storybook/theming'

import type { BadgeConfigOrBadgeFn } from 'src/schemas/badge'

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
  badgeConfig: BadgeConfigOrBadgeFn
  entry: HashEntry
  tag: string
  context: 'sidebar' | 'toolbar'
}

const BadgeUI = styled.div<
  Pick<BadgeProps, 'bgColor' | 'borderColor' | 'fgColor'>
>(({ as, bgColor, borderColor, fgColor, theme }) => ({
  display: 'inline-block',
  fontSize: 11,
  lineHeight: '.75rem',
  alignSelf: 'center',
  padding: '4px 12px',
  border: 'none',
  cursor: as === 'button' ? 'help' : 'initial',
  borderRadius: '3em',
  fontWeight: theme.typography.weight.bold,
  background: bgColor ?? theme.color.mediumlight,
  boxShadow:
    theme.base === 'light'
      ? `inset 0 0 0 1px ${borderColor ?? `color-mix(in oklab, ${fgColor ?? theme.color.dark} 10%, transparent 90%)`}`
      : (borderColor ?? 'none'),
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
      {!tooltip && (
        <BadgeUI {...restProps} theme={theme}>
          {text}
        </BadgeUI>
      )}
      {tooltip && (
        <WithTooltip
          closeOnOutsideClick
          placement={context === 'sidebar' ? 'right' : 'bottom'}
          tooltip={<TooltipUI>{tooltip}</TooltipUI>}
          // tooltip={<TooltipMessage desc={tooltip} links={[{
          //   title: 'Click me',
          //   onClick: () => window.open('https://google.fr', 'blank')
          // }]} />}
        >
          <BadgeUI as="button" {...restProps} theme={theme}>
            {text}
          </BadgeUI>
        </WithTooltip>
      )}
    </Fragment>
  )
}

export const WithBadge: React.FC<WithBadgeProps> = ({
  badgeConfig,
  entry,
  tag,
  ...restProps
}) => {
  const cfg =
    typeof badgeConfig === 'function'
      ? badgeConfig({ entry, tag })
      : badgeConfig

  return <Badge {...cfg} {...restProps} />
}
