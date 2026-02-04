import React, { type FC, useState, useEffect } from 'react'
import { useOf, type Of } from '@storybook/addon-docs/blocks'
import { styled } from 'storybook/theming'
import { addons } from 'storybook/internal/preview-api'

import { EVENTS, KEY } from '../constants'
import { WithBadge } from './Badge'
import { type Badge } from '../types/Badge'

export interface MDXBadgesProps {
  /**
   * Specify where to get the Badge tags from. Must be a CSF file's default export or a CSF story.
   * If not specified, the tags will be extracted from the meta of the attached CSF file.
   */
  of?: Of
}

const BadgeContainer = styled.span`
  vertical-align: middle;
  display: inline-flex;
  gap: 0.25em;
`

export const MDXBadges: FC<MDXBadgesProps> = (props) => {
  const { of } = props
  if ('of' in props && of === undefined) {
    throw new Error(
      'Unexpected `of={undefined}`, did you mistype a CSF file reference?',
    )
  }

  const fetchedOf = useOf(of || 'meta', ['meta', 'story'])
  const tags =
    fetchedOf.type === 'meta'
      ? fetchedOf.preparedMeta.tags
      : fetchedOf.story.tags

  const [badgesToDisplay, setBadgesToDisplay] = useState<
    Array<{ tag: string; badge: Badge }>
  >([])

  useEffect(() => {
    const channel = addons.getChannel()
    const requestId = `mdx-${Date.now()}-${Math.random()}`
    
    const handleResponse = (response: {
      requestId: string
      badges: Array<{ tag: string; badge: Badge }>
    }) => {
      if (response.requestId === requestId) {
        setBadgesToDisplay(response.badges)
      }
    }

    channel.on(EVENTS.MDX_BADGE_RENDER_RESPONSE, handleResponse)

    // Request badge data from manager
    channel.emit(EVENTS.REQUEST_MDX_BADGE_RENDER, {
      tags: tags || [],
      context: 'mdx',
      type: fetchedOf.type === 'meta' ? 'component' : 'story',
      requestId,
    })

    return () => {
      channel.off(EVENTS.MDX_BADGE_RENDER_RESPONSE, handleResponse)
    }
  }, [tags, fetchedOf.type])

  return badgesToDisplay.length ? (
    <BadgeContainer>
      {badgesToDisplay.map(({ badge, tag }) => (
        <WithBadge
          config={badge}
          context="mdx"
          entry={undefined}
          key={tag}
          tag={tag}
        />
      ))}
    </BadgeContainer>
  ) : (
    ''
  )
}
