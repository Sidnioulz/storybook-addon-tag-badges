import type { API } from 'storybook/manager-api'
import type { API_HashEntry } from 'storybook/internal/types'

import { getEntryTags } from '../entryTags'

type Hash = Record<string, API_HashEntry>

const branch = (
  type: 'component' | 'group',
  id: string,
  tags: string[],
  children: string[],
) => ({ id, type, name: id, tags, children, depth: 0 }) as API_HashEntry

const leaf = (
  type: 'docs' | 'story',
  id: string,
  tags: string[],
  extra: Record<string, unknown> = {},
) =>
  ({
    id,
    type,
    ...(type === 'story' && { subtype: 'story' }),
    name: id,
    tags,
    depth: 1,
    ...extra,
  }) as unknown as API_HashEntry

const toHash = (entries: API_HashEntry[]): Hash =>
  Object.fromEntries(entries.map((entry) => [entry.id, entry]))

const toApi = (hash: Hash, refs: Record<string, Hash> = {}) =>
  ({
    resolveStory: (id: string, refId?: string) =>
      refId ? refs[refId]?.[id] : hash[id],
  }) as unknown as API

// A component whose meta sets `new`, and one of whose stories removes it.
// Storybook gives the component `new` here, as if it read it from the meta.
const hash = toHash([
  branch('group', 'forms', [], ['foo', 'bar', 'forms--docs']),
  branch(
    'component',
    'foo',
    ['dev', 'test', 'new'],
    ['foo--one', 'foo--two', 'foo--five-old', 'foo--six'],
  ),
  leaf('story', 'foo--one', ['dev', 'test', 'new']),
  leaf('story', 'foo--two', ['dev', 'test', 'new']),
  leaf('story', 'foo--five-old', ['dev', 'test']),
  leaf('story', 'foo--six', ['dev', 'test', 'new']),
  branch('component', 'bar', ['dev'], ['bar--docs', 'bar--one', 'bar--two']),
  leaf('docs', 'bar--docs', ['dev', 'test', 'new', 'beta']),
  leaf('story', 'bar--one', ['dev', 'test', 'new', 'beta'], {
    children: ['bar--one:renders', 'bar--one:submits'],
  }),
  leaf('story', 'bar--one:renders', ['dev', 'test', 'new', 'beta'], {
    subtype: 'test',
  }),
  leaf('story', 'bar--one:submits', ['dev', 'test', 'new', 'beta'], {
    subtype: 'test',
  }),
  leaf('story', 'bar--two', ['dev', 'test', 'new', 'beta']),
  leaf('docs', 'forms--docs', ['dev', 'test', 'unattached-mdx', 'beta']),
])
const api = toApi(hash)
const legacy = { api, legacyTagIntersection: true }

describe('getEntryTags', () => {
  it('returns the tags Storybook gives an entry by default', () => {
    expect(getEntryTags(hash.foo, { api })).toEqual(['dev', 'test', 'new'])
    expect(getEntryTags(hash.forms, { api })).toEqual([])
  })

  describe('with legacyTagIntersection', () => {
    it('gives a component the tags that all of its stories have', () => {
      expect(getEntryTags(hash.foo, legacy)).toEqual(['dev', 'test'])
    })

    it('gives a component tags that Storybook did not give it', () => {
      expect(getEntryTags(hash.bar, legacy)).toEqual([
        'dev',
        'test',
        'new',
        'beta',
      ])
    })

    it('gives a group the tags that all entries below it have', () => {
      expect(getEntryTags(hash.forms, legacy)).toEqual(['dev', 'test'])
    })

    it('removes a tag that a docs entry lacks', () => {
      const withDocs = toHash([
        branch('component', 'baz', [], ['baz--docs', 'baz--one']),
        leaf('docs', 'baz--docs', ['dev']),
        leaf('story', 'baz--one', ['dev', 'new']),
      ])

      expect(
        getEntryTags(withDocs.baz, { ...legacy, api: toApi(withDocs) }),
      ).toEqual(['dev'])
    })

    it('removes a tag that a story test lacks', () => {
      const withTests = toHash([
        branch('component', 'baz', [], ['baz--one']),
        leaf('story', 'baz--one', ['dev', 'new'], {
          children: ['baz--one:renders'],
        }),
        leaf('story', 'baz--one:renders', ['dev'], { subtype: 'test' }),
      ])

      expect(
        getEntryTags(withTests.baz, { ...legacy, api: toApi(withTests) }),
      ).toEqual(['dev'])
    })

    it('keeps the own tags of docs, story and test entries', () => {
      const withTests = toHash([
        leaf('story', 'baz--one', ['dev', 'new'], {
          children: ['baz--one:renders'],
        }),
        leaf('story', 'baz--one:renders', ['dev'], { subtype: 'test' }),
      ])
      const options = { ...legacy, api: toApi(withTests) }

      expect(getEntryTags(withTests['baz--one'], options)).toEqual([
        'dev',
        'new',
      ])
      expect(getEntryTags(withTests['baz--one:renders'], options)).toEqual([
        'dev',
      ])
      expect(getEntryTags(hash['bar--docs'], legacy)).toEqual([
        'dev',
        'test',
        'new',
        'beta',
      ])
    })

    it('counts the entries that sidebar filters hide', () => {
      // Sidebar rows only list the children that pass the sidebar filters.
      const filteredRow = {
        ...hash.foo,
        children: ['foo--one', 'foo--two', 'foo--six'],
      } as API_HashEntry

      expect(getEntryTags(filteredRow, legacy)).toEqual(['dev', 'test'])
    })

    it('uses the children a row lists when the manager API does not know the row', () => {
      const row = branch(
        'component',
        'unknown',
        ['new'],
        ['foo--one', 'foo--five-old'],
      )

      expect(getEntryTags(row, legacy)).toEqual(['dev', 'test'])
    })

    it('reads the entries of a composed Storybook from its ref', () => {
      const composed = toHash([
        branch('component', 'foo', [], ['foo--one']),
        leaf('story', 'foo--one', ['dev', 'composed']),
      ])
      const row = { ...composed.foo, refId: 'design-system' } as API_HashEntry

      expect(
        getEntryTags(row, {
          ...legacy,
          api: toApi(hash, { 'design-system': composed }),
        }),
      ).toEqual(['dev', 'composed'])
    })

    it('returns the same list for an entry on every call', () => {
      // Callers memoise the badges of an entry by its list of tags.
      expect(getEntryTags(hash.forms, legacy)).toBe(
        getEntryTags(hash.forms, legacy),
      )
    })

    it('follows the entries of a sidebar index that Storybook rebuilt', () => {
      const build = (lastStoryTags: string[]) =>
        toHash([
          branch('component', 'baz', [], ['baz--one', 'baz--two']),
          leaf('story', 'baz--one', ['dev', 'new']),
          leaf('story', 'baz--two', lastStoryTags),
        ])
      const before = build(['dev'])
      const after = build(['dev', 'new'])

      expect(
        getEntryTags(before.baz, { ...legacy, api: toApi(before) }),
      ).toEqual(['dev'])
      expect(getEntryTags(after.baz, { ...legacy, api: toApi(after) })).toEqual(
        ['dev', 'new'],
      )
    })

    it('has no tags when no entry below it can be found', () => {
      const orphans = toHash([branch('group', 'empty', ['new'], ['missing'])])

      expect(
        getEntryTags(orphans.empty, { ...legacy, api: toApi(orphans) }),
      ).toEqual([])
    })

    it('returns the tags Storybook gives an entry without the manager API', () => {
      expect(getEntryTags(hash.foo, { legacyTagIntersection: true })).toEqual([
        'dev',
        'test',
        'new',
      ])
    })
  })
})
