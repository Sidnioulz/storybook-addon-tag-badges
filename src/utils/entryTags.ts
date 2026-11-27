import type { API } from 'storybook/manager-api'
import type { API_HashEntry } from 'storybook/internal/types'

type BranchEntry = Extract<API_HashEntry, { type: 'component' | 'group' }>
type Resolve = (id: string) => API_HashEntry | undefined

export interface EntryTagsOptions {
  /** The manager API, used to find the entries below a component or group. */
  api?: API
  /** The `legacyTagIntersection` option of the addon. */
  legacyTagIntersection?: boolean
}

function isBranch(entry: API_HashEntry): entry is BranchEntry {
  return entry.type === 'component' || entry.type === 'group'
}

// Storybook creates new entries whenever it rebuilds its sidebar index, so
// the tags of an entry never need to be computed twice. Returning the same
// list for an entry also lets callers memoise what they derive from it.
const sharedTagsByEntry = new WeakMap<BranchEntry, string[]>()

/**
 * Returns the tags that every docs, story and test entry below a component or
 * group has, in the order of the first of these entries.
 */
function intersectDescendantTags(
  entry: BranchEntry,
  resolve: Resolve,
): string[] {
  const cached = sharedTagsByEntry.get(entry)
  if (cached) {
    return cached
  }

  const tagLists = entry.children.flatMap((id) => {
    const child = resolve(id)
    if (!child) {
      return []
    }
    if (isBranch(child)) {
      return [intersectDescendantTags(child, resolve)]
    }

    const tests = 'children' in child ? (child.children ?? []) : []
    return [child, ...tests.map(resolve)].flatMap((leaf) =>
      leaf ? [leaf.tags] : [],
    )
  })

  const sharedTags = tagLists.length
    ? tagLists.reduce((shared, tags) =>
        shared.filter((tag) => tags.includes(tag)),
      )
    : []
  sharedTagsByEntry.set(entry, sharedTags)
  return sharedTags
}

/**
 * Returns the tags to match badges against for a sidebar entry.
 *
 * These are the tags Storybook gives the entry, unless the
 * `legacyTagIntersection` option is on: component and group entries then
 * have the tags that all the docs, story and test entries below them have in
 * common, whichever tags Storybook gives them.
 *
 * The entries below a component or group are read from the manager API,
 * which knows them all. A sidebar row only lists those that pass the sidebar
 * filters, and filters must not change which badges an entry has.
 */
export function getEntryTags(
  entry: API_HashEntry,
  { api, legacyTagIntersection }: EntryTagsOptions,
): string[] {
  if (!legacyTagIntersection || !api || !isBranch(entry)) {
    return entry.tags
  }

  const resolve: Resolve = (id) => api.resolveStory(id, entry.refId)
  const unfiltered = resolve(entry.id)
  return intersectDescendantTags(
    unfiltered && isBranch(unfiltered) ? unfiltered : entry,
    resolve,
  )
}
