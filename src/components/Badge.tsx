import React, { Fragment } from 'react'
import type { HashEntry } from 'storybook/manager-api'
import {
  Link,
  PopoverProvider,
  Tooltip,
  TooltipProvider,
} from 'storybook/internal/components'
import { styled, useTheme } from 'storybook/theming/emotion'

import type {
  Badge as BadgeConfigType,
  BadgeOrBadgeFn,
  BadgeTooltipMessage,
} from '../types/Badge'
import { getTagParts, getTagPrefix, getTagSuffix } from '../utils/tag'
import { type BadgeContext, BadgeUI, getBadgeStyle } from './BadgeUI'
import { CompactBadge } from './CompactBadge'

interface BadgeProps extends BadgeConfigType {
  context: BadgeContext
  /** Renders a compact pill in the sidebar. */
  compact?: boolean
}

interface WithBadgeProps {
  config: BadgeOrBadgeFn
  entry: HashEntry | undefined
  tag: string
  context: BadgeContext
  compact?: boolean
}

const TooltipUI = styled.div(({ theme }) => ({
  padding: '8px 12px',
  boxSizing: 'border-box',
  color: theme.color.defaultText,
  lineHeight: '1.125rem',
}))

const TooltipMessageUI = styled.div(({ theme }) => ({
  boxSizing: 'border-box',
  color: theme.color.defaultText,
  lineHeight: '1.125rem',
  maxWidth: 280,
}))

const TooltipMessageTitleUI = styled.div(({ theme }) => ({
  fontWeight: theme.typography.weight.bold,
}))

const TooltipMessageLinksUI = styled.div({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 12,
  marginTop: 8,
})

const TooltipMessageContent: React.FC<BadgeTooltipMessage> = ({
  title,
  desc,
  links,
}) => (
  <TooltipMessageUI>
    {title ? <TooltipMessageTitleUI>{title}</TooltipMessageTitleUI> : null}
    {desc ?? null}
    {links?.length ? (
      <TooltipMessageLinksUI>
        {links.map(({ title: linkTitle, ...linkProps }) => (
          <Link key={linkTitle} {...linkProps}>
            {linkTitle}
          </Link>
        ))}
      </TooltipMessageLinksUI>
    ) : null}
  </TooltipMessageUI>
)

export const Badge: React.FC<BadgeProps> = ({
  compact,
  context,
  shortText,
  style,
  text,
  tooltip,
}) => {
  const theme = useTheme()

  const extraStyle = getBadgeStyle(style)

  if (typeof text !== 'string') {
    throw new Error(
      'Badge: the text prop must be defined and must be a string.',
    )
  }

  if (context === 'sidebar' && compact) {
    return (
      <CompactBadge extraStyle={extraStyle} shortText={shortText} text={text} />
    )
  }

  const hasLongText = text.length > 15

  if (!tooltip || context == 'sidebar') {
    return (
      <BadgeUI
        context={context}
        extraStyle={extraStyle}
        hasLongText={hasLongText}
        theme={theme}
      >
        {text}
      </BadgeUI>
    )
  }

  const badgeButton = (
    <BadgeUI
      as="button"
      context={context}
      extraStyle={extraStyle}
      hasLongText={hasLongText}
      theme={theme}
    >
      {text}
    </BadgeUI>
  )

  return (
    <Fragment>
      {typeof tooltip === 'string' ? (
        <TooltipProvider
          placement="bottom"
          tooltip={
            <Tooltip hasChrome>
              <TooltipUI>{tooltip}</TooltipUI>
            </Tooltip>
          }
        >
          {badgeButton}
        </TooltipProvider>
      ) : (
        <PopoverProvider
          ariaLabel={typeof tooltip.title === 'string' ? tooltip.title : text}
          placement="bottom"
          popover={<TooltipMessageContent {...tooltip} />}
        >
          {badgeButton}
        </PopoverProvider>
      )}
    </Fragment>
  )
}

export function getBadgeProps(
  config: BadgeOrBadgeFn,
  entry: HashEntry | undefined,
  tag: string,
  context: 'mdx' | 'sidebar' | 'toolbar',
): Omit<BadgeProps, 'context'> {
  const props =
    typeof config === 'function'
      ? config({ context, entry, getTagParts, getTagPrefix, getTagSuffix, tag })
      : config

  return props
}

export const WithBadge: React.FC<WithBadgeProps> = ({
  context,
  config,
  entry,
  tag,
  ...restProps
}) => {
  const cfg = getBadgeProps(config, entry, tag, context)

  return <Badge {...cfg} context={context} {...restProps} />
}
