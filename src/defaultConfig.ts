import type {
  TagBadgeParameter,
  TagBadgeParameters,
} from './types/TagBadgeParameters'

export const newBadge: TagBadgeParameter = {
  tags: 'new',
  badge: {
    text: 'New',
    style: 'green',
  },
}

const PRE_RELEASE_SHORT_TEXTS: Record<string, string> = {
  alpha: 'α',
  beta: 'β',
  rc: 'rc',
  experimental: 'exp',
}

export const preReleaseBadge: TagBadgeParameter = {
  tags: ['alpha', 'beta', 'rc', 'experimental'],
  badge: ({ tag }) => {
    const upperFirst = (str: string): string =>
      str[0].toUpperCase() + str.slice(1)

    return {
      text: tag === 'rc' ? 'Release candidate' : upperFirst(tag),
      shortText: PRE_RELEASE_SHORT_TEXTS[tag],
      style: 'purple',
    }
  },
}

export const deprecatedBadge: TagBadgeParameter = {
  tags: 'deprecated',
  badge: {
    text: 'Deprecated',
    shortText: 'depr',
    style: 'yellow',
  },
}

export const outdatedBadge: TagBadgeParameter = {
  tags: 'outdated',
  badge: {
    text: 'Outdated',
    shortText: 'old',
    style: 'orange',
  },
}

export const dangerBadge: TagBadgeParameter = {
  tags: 'danger',
  badge: {
    text: 'Danger',
    // The warning sign, shown as text rather than as an emoji.
    shortText: '\u26A0\uFE0E',
    style: 'red',
  },
}

export const codeOnlyBadge: TagBadgeParameter = {
  tags: ['code-only'],
  badge: {
    text: 'Code Only',
    shortText: 'code',
    style: 'grey',
  },
}

export const versionBadge: TagBadgeParameter = {
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
}

export const defaultConfig: TagBadgeParameters = [
  newBadge,
  preReleaseBadge,
  deprecatedBadge,
  outdatedBadge,
  dangerBadge,
  codeOnlyBadge,
  versionBadge,
]
