import React from 'react'
import type { Parameters } from '../schemas/parameters'
// import { Tags } from '../schemas/tags'
import { matchTags } from '../utils/tag'
// import { styled } from '@storybook/theming'

interface BadgeMatchDebuggerProps {
  tags: string[]
  parameters: Parameters
}

export const BadgeMatchDebugger: React.FC<BadgeMatchDebuggerProps> = ({
  parameters,
  tags,
}) => {
  const match = parameters.match.find((matchers) =>
    matchTags(tags, matchers.tags),
  )
  console.log('match', match)

  const blaa = parameters.match
    .find((matchers) => matchTags(tags, matchers))
    ?.tags.toString()

  return (
    <ul>
      {tags.map((tag) => (
        <li key={tag}>
          <span className="tag">{tag}</span>
          <span className="outcome">{blaa}</span>
        </li>
      ))}
    </ul>
  )
}
