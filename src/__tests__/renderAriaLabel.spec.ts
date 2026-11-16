import type { API } from 'storybook/manager-api'
import type { API_HashEntry } from 'storybook/internal/types'

import { renderAriaLabel } from '../renderAriaLabel'
import type { TagBadgeParameters } from '../types/TagBadgeParameters'

const parameters: TagBadgeParameters = [
  {
    tags: 'deprecated',
    badge: { text: 'Deprecated', shortText: 'Dep' },
    display: { sidebar: true },
  },
  {
    tags: { prefix: 'version' },
    badge: ({ getTagSuffix, tag }) => ({ text: `v${getTagSuffix(tag)}` }),
    display: { sidebar: true },
  },
  {
    tags: 'flaky',
    badge: { text: 'Flaky' },
    display: { sidebar: [{ type: 'test', skipInherited: true }] },
  },
  {
    tags: 'inherited',
    badge: { text: 'Inherited' },
    display: {
      sidebar: [
        { type: 'component', skipInherited: false },
        { type: 'story', skipInherited: true },
      ],
    },
  },
]

const config: Record<string, unknown> = { tagBadges: parameters }

vi.mock('storybook/manager-api', () => ({
  addons: { getConfig: () => config },
}))

const entry = (tags: string[], extra: Record<string, unknown> = {}) =>
  ({
    id: 'example-button--primary',
    type: 'story',
    subtype: 'story',
    name: 'Primary',
    title: 'Example/Button',
    importPath: './Button.stories.tsx',
    tags,
    depth: 2,
    parent: 'example-button',
    prepared: false,
    ...extra,
  }) as unknown as API_HashEntry

const api = {
  resolveStory: (id: string) =>
    id === 'example-button'
      ? { id, type: 'component', tags: ['inherited'], depth: 1 }
      : undefined,
} as unknown as API

const sidebar = { isMobile: false, location: 'sidebar' } as const

describe('renderAriaLabel', () => {
  it('appends the full text of the badge shown in the sidebar', () => {
    expect(renderAriaLabel(entry(['deprecated']), api, sidebar)).toBe(
      'Primary. Deprecated',
    )
  })

  it('only names the highest-priority badge, like the sidebar', () => {
    expect(
      renderAriaLabel(entry(['version:2.0.0', 'deprecated']), api, sidebar),
    ).toBe('Primary. Deprecated')
  })

  it('names badges computed by a badge function', () => {
    expect(renderAriaLabel(entry(['version:2.0.0']), api, sidebar)).toBe(
      'Primary. v2.0.0',
    )
  })

  it('names the badges of story tests', () => {
    const test = entry(['flaky'], { subtype: 'test', name: 'Renders' })

    expect(renderAriaLabel(test, api, sidebar)).toBe('Renders. Flaky')
    expect(renderAriaLabel(entry(['flaky']), api, sidebar)).toBe('Primary')
  })

  it('returns the name alone when no badge matches', () => {
    expect(renderAriaLabel(entry(['other']), api, sidebar)).toBe('Primary')
  })

  it('skips badges inherited from a parent that shows them', () => {
    expect(renderAriaLabel(entry(['inherited']), api, sidebar)).toBe('Primary')
  })

  it('returns the name alone in the mobile bottom bar, which shows no badge', () => {
    expect(
      renderAriaLabel(entry(['deprecated']), api, {
        isMobile: true,
        location: 'bottom-bar',
      }),
    ).toBe('Primary')
  })

  it('returns the name alone for root entries', () => {
    const root = {
      id: 'example',
      type: 'root',
      name: 'Example',
      tags: ['deprecated'],
      depth: 0,
      children: [],
    } as unknown as API_HashEntry

    expect(renderAriaLabel(root, api, sidebar)).toBe('Example')
  })
})
