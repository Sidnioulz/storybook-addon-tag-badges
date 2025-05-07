import React, { type FC } from 'react'
import { useOf, type Of } from '@storybook/blocks'
import { styled } from '@storybook/theming'

import { KEY } from '../constants'
import { WithBadge } from './Badge'
import { useBadgesToDisplay } from '../useBadgesToDisplay'
import { type TagBadgeParameters } from '../types/TagBadgeParameters'

declare global {
  interface Window {
    tagBadges: TagBadgeParameters
  }
}

interface MDXBadgesProps {
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

  const badgesToDisplay = useBadgesToDisplay({
    context: 'sidebar',
    parameters: window[KEY],
    tags: tags || [],
    type: fetchedOf.type === 'meta' ? 'component' : 'story',
  })

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
    'ø'
  )
}
