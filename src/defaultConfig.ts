import type { TagBadgeParameters } from './types/TagBadgeParameters'

export const defaultConfig: TagBadgeParameters = [
  {
    display: {
      sidebar: ['component'],
      toolbar: ['story', 'docs'],
    },
    tags: 'new',
    badge: {
      text: 'New',
      bgColor: 'hsl(130, 100%, 74%)',
      borderColor: 'hsl(130, 100%, 34%)',
      fgColor: 'hsl(130, 100%, 6%)',
    },
  },
  {
    tags: ['alpha', 'beta', 'rc', 'experimental'],
    badge: ({ tag }) => {
      const upperFirst = (str: string): string =>
        str[0].toUpperCase() + str.slice(1)

      return {
        text: tag === 'rc' ? 'Release candidate' : upperFirst(tag),
        bgColor: 'hsl(257, 100%, 84%)',
        borderColor: 'hsl(257, 100%, 64%)',
        fgColor: 'hsl(257, 100%, 12%)',
      }
    },
  },
  {
    tags: 'deprecated',
    badge: {
      text: 'Deprecated',
      bgColor: 'hsl(36, 100%, 74%)',
      borderColor: 'hsl(36, 100%, 34%)',
      fgColor: 'hsl(36, 100%, 12%)',
    },
  },
  {
    tags: 'outdated',
    badge: {
      text: 'Outdated',
      bgColor: 'hsl(12, 100%, 74%)',
      borderColor: 'hsl(12, 100%, 34%)',
      fgColor: 'hsl(12, 100%, 12%)',
    },
  },
  {
    tags: 'danger',
    badge: {
      text: 'Danger',
      bgColor: 'hsl(0, 100%, 44%)',
      borderColor: 'hsl(0, 100%, 64%)',
      fgColor: 'hsl(0, 100%, 94%)',
    },
  },
  {
    tags: ['code-only'],
    badge: {
      text: 'Code Only',
      bgColor: 'hsl(84, 0%, 84%)',
      borderColor: 'hsl(84, 0%, 34%)',
      fgColor: 'hsl(84, 0%, 12%)',
    },
  },
  {
    tags: {
      prefix: 'version',
    },
    badge: ({ getTagSuffix, tag }) => {
      const version = getTagSuffix(tag)
      const isExperimental = version?.startsWith('0')
      const hue = isExperimental ? 66 : 194

      return {
        text: `${version}`,
        bgColor: `hsl(${hue}, 100%, 74%)`,
        borderColor: `hsl(${hue}, 100%, 34%)`,
        fgColor: `hsl(${hue}, 100%, 12%)`,
        tooltip: `Version ${version}${isExperimental ? '. Experimental!' : ''}`,
      }
    },
  },
]
