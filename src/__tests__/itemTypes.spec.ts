import {
  getItemType,
  itemIsComponent,
  itemIsDocs,
  itemIsGroup,
  itemIsRoot,
  itemIsStory,
  itemIsTest,
} from '../itemTypes'
import {
  API_ComponentEntry,
  API_DocsEntry,
  API_GroupEntry,
  API_RootEntry,
  API_StoryEntry,
  API_TestEntry,
} from 'storybook/internal/types'

const testItem = {
  id: 'badge-primary-passes',
  title: 'Components/Badge/Primary',
  name: 'passes a test',
  parent: 'badge-primary',
  type: 'story',
  subtype: 'test',
  depth: 4,
  tags: [],
  importPath: './Badge.stories.tsx',
  prepared: false,
} satisfies API_TestEntry
const story = {
  id: 'badge-primary',
  title: 'Components/Badge/Primary',
  name: 'Primary',
  parent: 'badge',
  type: 'story',
  subtype: 'story',
  depth: 3,
  children: [],
  tags: [],
  importPath: './Badge.stories.tsx',
  prepared: false,
} satisfies API_StoryEntry
const docs = {
  id: 'badge--docs',
  title: 'Components/Badge',
  name: 'Badge',
  parent: 'badge',
  type: 'docs',
  depth: 3,
  tags: [],
  importPath: './Badge.stories.tsx',
  prepared: false,
} satisfies API_DocsEntry

const component = {
  id: 'badge',
  name: 'Badge',
  type: 'component',
  depth: 2,
  children: ['badge--docs', 'badge-primary'],
  tags: [],
} satisfies API_ComponentEntry

const group = {
  id: 'components',
  name: 'Components',
  type: 'group',
  depth: 1,
  children: ['badge'],
  tags: [],
} satisfies API_GroupEntry

const root = {
  id: 'root',
  name: 'Root',
  type: 'root',
  depth: 0,
  children: ['components'],
  tags: [],
} satisfies API_RootEntry

describe('itemTypes', () => {
  describe('getItemType', () => {
    it('returns root for root items', () => {
      expect(getItemType(root)).toEqual('root')
    })

    it('returns group for group items', () => {
      expect(getItemType(group)).toEqual('group')
    })

    it('returns component for component items', () => {
      expect(getItemType(component)).toEqual('component')
    })

    it('returns docs for docs items', () => {
      expect(getItemType(docs)).toEqual('docs')
    })

    it('returns story for story items', () => {
      expect(getItemType(story)).toEqual('story')
    })

    it('returns test for test items', () => {
      expect(getItemType(testItem)).toEqual('test')
    })
  })

  describe('item type guards', () => {
    it('itemIsRoot identifies root items', () => {
      expect(itemIsRoot(root)).toBeTruthy()
      expect(itemIsRoot(group)).toBeFalsy()
      expect(itemIsRoot(component)).toBeFalsy()
      expect(itemIsRoot(docs)).toBeFalsy()
      expect(itemIsRoot(story)).toBeFalsy()
      expect(itemIsRoot(testItem)).toBeFalsy()
    })

    it('itemIsGroup identifies group items', () => {
      expect(itemIsGroup(root)).toBeFalsy()
      expect(itemIsGroup(group)).toBeTruthy()
      expect(itemIsGroup(component)).toBeFalsy()
      expect(itemIsGroup(docs)).toBeFalsy()
      expect(itemIsGroup(story)).toBeFalsy()
      expect(itemIsGroup(testItem)).toBeFalsy()
    })

    it('itemIsComponent identifies component items', () => {
      expect(itemIsComponent(root)).toBeFalsy()
      expect(itemIsComponent(group)).toBeFalsy()
      expect(itemIsComponent(component)).toBeTruthy()
      expect(itemIsComponent(docs)).toBeFalsy()
      expect(itemIsComponent(story)).toBeFalsy()
      expect(itemIsComponent(testItem)).toBeFalsy()
    })

    it('itemIsDocs identifies docs items', () => {
      expect(itemIsDocs(root)).toBeFalsy()
      expect(itemIsDocs(group)).toBeFalsy()
      expect(itemIsDocs(component)).toBeFalsy()
      expect(itemIsDocs(docs)).toBeTruthy()
      expect(itemIsDocs(story)).toBeFalsy()
      expect(itemIsDocs(testItem)).toBeFalsy()
    })

    it('itemIsStory identifies story items', () => {
      expect(itemIsStory(root)).toBeFalsy()
      expect(itemIsStory(group)).toBeFalsy()
      expect(itemIsStory(component)).toBeFalsy()
      expect(itemIsStory(docs)).toBeFalsy()
      expect(itemIsStory(story)).toBeTruthy()
      expect(itemIsStory(testItem)).toBeFalsy()
    })

    it('itemIsTest identifies test items', () => {
      expect(itemIsTest(root)).toBeFalsy()
      expect(itemIsTest(group)).toBeFalsy()
      expect(itemIsTest(component)).toBeFalsy()
      expect(itemIsTest(docs)).toBeFalsy()
      expect(itemIsTest(story)).toBeFalsy()
      expect(itemIsTest(testItem)).toBeTruthy()
    })
  })
})
