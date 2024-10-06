import type { HashEntry } from '@storybook/manager-api'

import { getTagSuffix } from './utils'

export const defaultConfig = [
  {
    tags: 'new',
    badge: {
      text: 'New!',
      bgColor: 'hsl(168, 100%, 64%)',
      borderColor: 'hsl(168, 100%, 34%)',
      fgColor: 'hsl(168, 100%, 12%)',
      tooltip: 'This component was released in the past two weeks!',
    },
  },
  {
    tags: ['alpha', 'beta', 'rc'],
    badge: {
      text: 'Unstable: {{tag}}',
      bgColor: 'hsl(44, 100%, 64%)',
      borderColor: 'hsl(44, 100%, 34%)',
      fgColor: 'hsl(44, 100%, 12%)',
    },
  },
  {
    tags: {
      prefix: 'version',
    },
    badge: {
      text: 'v{{suffix}}',
      bgColor: 'hsl(194, 100%, 64%)',
      borderColor: 'hsl(194, 100%, 34%)',
      fgColor: 'hsl(194, 100%, 12%)',
      tooltip: 'Version {{$1}}',
    },
  },
  {
    tags: {
      prefix: 'version',
    },
    badge: ({ tag }: { entry: HashEntry; tag: string }) => {
      const version = getTagSuffix(tag)
      const isExperimental = version?.startsWith('0')
      const hue = isExperimental ? 66 : 120

      return {
        text: `${version}`,
        bgColor: `hsl(${hue}, 100%, 64%)`,
        borderColor: `hsl(${hue}, 100%, 34%)`,
        fgColor: `hsl(${hue}, 100%, 12%)`,
        tooltip: `Version ${version}${isExperimental ? '. Experimental!' : ''}`,
      }
    },
  },
]
