import { getTagSuffix } from './utils/tag'
import type { TagBadgeParameters } from './types/TagBadgeParameters'

export const defaultConfig: TagBadgeParameters = [
  {
    display: {
      sidebar: ['component'],
      toolbar: ['component', 'story', 'docs'],
    },
    tags: 'new',
    badge: {
      text: 'New!',
      bgColor: 'hsl(168, 100%, 64%)',
      borderColor: 'hsl(168, 100%, 34%)',
      fgColor: 'hsl(168, 100%, 12%)',
      tooltip: 'This component was released recently!',
    },
  },
  // {
  //   tags: ['alpha', 'beta', 'rc'],
  //   badge: ({ tag }) => {
  //     console.log('hi', tag)
  //     return {
  //       text: `Unstable: ${tag}`,
  //       bgColor: 'hsl(44, 100%, 64%)',
  //       borderColor: 'hsl(44, 100%, 34%)',
  //       fgColor: 'hsl(44, 100%, 12%)',
  //     }
  //   },
  // },
  {
    tags: [
      {
        prefix: 'group',
      },
      {
        prefix: 'category',
      },
    ],
    badge: {
      text: '{{suffix}}',
      bgColor: 'hsl(194, 100%, 64%)',
      borderColor: 'hsl(194, 100%, 34%)',
      fgColor: 'hsl(194, 100%, 12%)',
    },
  },
  {
    tags: {
      prefix: 'version',
    },
    badge: ({ tag }) => {
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
