import { themes } from '@storybook/theming'
import type { TagBadgeParameters } from './types/TagBadgeParameters'

export const byMarket: TagBadgeParameters = [
  {
    tags: { prefix: 'market', suffix: /.+/ },
    badge: ({ getTagSuffix, tag }) => {
      const market = getTagSuffix(tag) ?? ''

      const shorthands: Record<string, string> = {
        b2b: 'B2B',
        b2c: 'B2C',
        finance: 'FIN',
        government: 'GOV',
        health: 'MED',
        all: 'ALL',
      }

      const emojis: Record<string, string> = {
        b2b: '🏢',
        b2c: '🛍️',
        finance: '💸',
        government: '🏛️',
        health: '⚕️',
        all: '',
      }

      return {
        text: [shorthands[market], emojis[market]].filter(Boolean).join(' '),
        bgColor: '#cceeff',
        borderColor: '#330099',
        fgColor: '#110033',
        tooltip: `For use in products destined to the ${market} market/industry.`,
      }
    },
  },
] satisfies TagBadgeParameters

export const brandComponents: TagBadgeParameters = [
  {
    tags: 'brand',
    badge: {
      text: 'Brand',
      bgColor:
        'linear-gradient(to right in lch, rgba(255,255,0,.7) 0%, rgba(32,254,62,1) 100%)',
      borderColor: 'transparent',
      fgColor: themes.dark.textInverseColor,
      tooltip: `This component can help create strong brand moments.`,
    },
  },
  {
    tags: 'ui',
    badge: {
      text: 'UI',
      tooltip: `This component is lightly branded and serves a functional purpose.`,
    },
  },
] satisfies TagBadgeParameters

export const composition: TagBadgeParameters = [
  {
    tags: { prefix: 'compose' },
    badge: ({ getTagSuffix, tag }) => ({
      text: `🧩 ${getTagSuffix(tag)}`,
      bgColor: 'linear-gradient(to bottom in lch, #1f1f24 0%, #22222c)',
      fgColor: '#e0e0eb',
    }),
  },
]

export const compliance: TagBadgeParameters = [
  {
    tags: { suffix: 'fail' },
    badge: ({ getTagPrefix, tag }) => ({
      text: `${getTagPrefix(tag)} ✗`,
      bgColor: '#aa0000',
      fgColor: '#fff',
    }),
  },
  {
    tags: { suffix: 'success' },
    badge: ({ getTagPrefix, tag }) => ({
      text: `${getTagPrefix(tag)} ✓`,
      bgColor: '#006633',
      fgColor: '#fff',
    }),
  },
]

export const dependencies: TagBadgeParameters = [
  {
    tags: { prefix: 'uses' },
    badge: ({ getTagSuffix, tag }) => ({
      text: `🔗 ${getTagSuffix(tag)}`,
      bgColor: 'linear-gradient(to bottom in lch, #1b1816 0%, #22201e)',
      borderColor: '#eee1',
      fgColor: '#eeebe0',
    }),
  },
]
export const smartComponents: TagBadgeParameters = [
  {
    tags: { prefix: 'smart' },
    badge: ({ getTagSuffix, tag }) => ({
      text: `🧠 ${getTagSuffix(tag)}`,
      bgColor: 'linear-gradient(to bottom in lch, #161622 0%, #1c1c29)',
      borderColor: '#eee1',
      fgColor: '#eeeefe',
    }),
  },
]
