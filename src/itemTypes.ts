import type {
  API_ComponentEntry,
  API_DocsEntry,
  API_GroupEntry,
  API_HashEntry,
  API_RootEntry,
  API_StoryEntry,
  API_TestEntry,
} from 'storybook/internal/types'

export function getItemType<T extends API_HashEntry>(
  item: T,
): T extends { subtype: infer S } ? T['type'] | S : T['type'] {
  return ('subtype' in item ? item.subtype : item.type) as T extends {
    subtype: infer S
  }
    ? S
    : T['type']
}

export function itemIsRoot(item: API_HashEntry): item is API_RootEntry {
  return getItemType(item) === 'root'
}

export function itemIsGroup(item: API_HashEntry): item is API_GroupEntry {
  return getItemType(item) === 'group'
}

export function itemIsComponent(
  item: API_HashEntry,
): item is API_ComponentEntry {
  return getItemType(item) === 'component'
}

export function itemIsStory(item: API_HashEntry): item is API_StoryEntry {
  return getItemType(item) === 'story'
}

export function itemIsDocs(item: API_HashEntry): item is API_DocsEntry {
  return getItemType(item) === 'docs'
}

export function itemIsTest(item: API_HashEntry): item is API_TestEntry {
  return getItemType(item) === 'test'
}
