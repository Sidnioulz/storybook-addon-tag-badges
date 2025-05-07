import type { TagBadgeParameters } from './types/TagBadgeParameters'

export const defaultConfig: TagBadgeParameters = [
  {
    tags: 'new',
    badge: {
      text: 'New',
      style: 'green',
    },
  },
  {
    tags: ['alpha', 'beta', 'rc', 'experimental'],
    badge: ({ tag }) => {
      const upperFirst = (str: string): string =>
        str[0].toUpperCase() + str.slice(1)

      return {
        text: tag === 'rc' ? 'Release candidate' : upperFirst(tag),
        style: 'purple',
      }
    },
  },
  {
    tags: 'deprecated',
    badge: {
      text: 'Deprecated',
      style: 'yellow',
    },
  },
  {
    tags: 'outdated',
    badge: {
      text: 'Outdated',
      style: 'orange',
    },
  },
  {
    tags: 'danger',
    badge: {
      text: 'Danger',
      style: 'red',
    },
  },
  {
    tags: ['code-only'],
    badge: {
      text: 'Code Only',
      style: 'grey',
    },
  },
  {
    tags: [
      {
        prefix: 'v',
      },
      {
        prefix: 'version',
      },
    ],
    badge: ({ getTagSuffix, tag }) => {
      const version = getTagSuffix(tag)
      const isExperimental = version?.startsWith('0')

      return {
        text: `${version}`,
        style: isExperimental ? 'turquoise' : 'blue',
      }
    },
  },
]
