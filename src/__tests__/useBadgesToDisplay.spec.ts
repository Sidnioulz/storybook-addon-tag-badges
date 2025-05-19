import { renderHook } from '@testing-library/react'

import { useBadgesToDisplay } from '../useBadgesToDisplay'
import { TagBadgeParameters } from '../types/TagBadgeParameters'
import { BadgeOrBadgeFn } from '../types/Badge'
import { defaultConfig } from '../defaultConfig'

vi.mock('storybook/manager-api', () => ({
  useStorybookApi: vi.fn(() => ({
    resolveStory: vi.fn().mockImplementation((id) => {
      if (id === 'mock-component') {
        return { type: 'component', tags: ['test1', 'test2', 'test3'] }
      }
      return { type: 'component', tags: [] }
    }),
  })),
}))

describe('useBadgesToDisplay', () => {
  describe('Hook', () => {
    describe('matching', () => {
      const parameters: TagBadgeParameters = [
        {
          tags: ['test1', 'test2'],
          badge: { text: 'Test Badge' },
          display: { sidebar: true, toolbar: true },
        },
      ]

      it('returns an empty array when parameters are empty', () => {
        const { result } = renderHook(() =>
          useBadgesToDisplay({
            context: 'sidebar',
            parameters: [],
            tags: [],
            type: 'story',
          }),
        )

        expect(result.current).toEqual([])
      })

      it("returns no match when input tags don't match parameters", () => {
        const { result } = renderHook(() =>
          useBadgesToDisplay({
            context: 'sidebar',
            parameters,
            tags: ['other'],
            type: 'story',
          }),
        )

        expect(result.current).toHaveLength(0)
      })

      it('returns a match when input tags match parameters', () => {
        const tag = 'test1'
        const { result } = renderHook(() =>
          useBadgesToDisplay({
            context: 'sidebar',
            parameters,
            tags: [tag],
            type: 'story',
          }),
        )

        expect(result.current).toHaveLength(1)
        expect(result.current[0].tag).toEqual(tag)
        expect(result.current[0].badge).toEqual(parameters[0].badge)
      })

      it('handles multiple matching tags', () => {
        const parameters: TagBadgeParameters = [
          {
            tags: ['test1', 'test2'],
            badge: { text: 'Test Badge' },
            display: { sidebar: true, toolbar: true },
          },
        ]

        const { result } = renderHook(() =>
          useBadgesToDisplay({
            context: 'sidebar',
            parameters,
            tags: ['test1', 'test2', 'other'],
            type: 'story',
          }),
        )

        expect(result.current).toHaveLength(2)
        expect(result.current[0].tag).toBe('test1')
        expect(result.current[0].badge).toBe(parameters[0].badge)
        expect(result.current[1].tag).toBe('test2')
        expect(result.current[1].badge).toBe(parameters[0].badge)
      })
    })

    describe('shouldDisplay', () => {
      const parameters: TagBadgeParameters = [
        {
          tags: ['test1'],
          badge: { text: 'Test1' },
          display: { sidebar: true, toolbar: false },
        },
        {
          tags: ['test2'],
          badge: { text: 'Test2' },
          display: { sidebar: false, toolbar: true },
        },
        {
          tags: ['test3'],
          badge: { text: 'Test3' },
          display: {
            mdx: 'component',
            sidebar: [{ type: 'story', skipInherited: false }],
            toolbar: 'docs',
          },
        },
      ]

      it('only shows badges whose config matches the sidebar context', () => {
        const { result: sidebarResult } = renderHook(() =>
          useBadgesToDisplay({
            context: 'sidebar',
            parameters,
            tags: ['test1', 'test2'],
            type: 'story',
          }),
        )

        expect(sidebarResult.current).toHaveLength(1)
        expect(sidebarResult.current[0].badge).toEqual({ text: 'Test1' })
      })

      it('only shows badges whose config matches the toolbar context', () => {
        const { result: toolbarResult } = renderHook(() =>
          useBadgesToDisplay({
            context: 'toolbar',
            parameters,
            tags: ['test1', 'test2'],
            type: 'story',
          }),
        )

        expect(toolbarResult.current).toHaveLength(1)
        expect(toolbarResult.current[0].badge).toEqual({ text: 'Test2' })
      })

      it('only shows badges whose config matches the story hash entry type', () => {
        const { result: toolbarResult } = renderHook(() =>
          useBadgesToDisplay({
            context: 'toolbar',
            parameters,
            tags: ['test3'],
            type: 'story',
          }),
        )

        const { result: mdxResult } = renderHook(() =>
          useBadgesToDisplay({
            context: 'mdx',
            parameters,
            tags: ['test3'],
            type: 'story',
          }),
        )

        const { result: sidebarResult } = renderHook(() =>
          useBadgesToDisplay({
            context: 'sidebar',
            parameters,
            tags: ['test3'],
            type: 'story',
          }),
        )

        expect(toolbarResult.current).toHaveLength(0)
        expect(mdxResult.current).toHaveLength(0)
        expect(sidebarResult.current).toHaveLength(1)
        expect(sidebarResult.current[0].badge).toEqual({ text: 'Test3' })
      })

      it('only shows badges whose config matches the component hash entry type', () => {
        const { result: toolbarResult } = renderHook(() =>
          useBadgesToDisplay({
            context: 'toolbar',
            parameters,
            tags: ['test3'],
            type: 'component',
          }),
        )

        const { result: mdxResult } = renderHook(() =>
          useBadgesToDisplay({
            context: 'mdx',
            parameters,
            tags: ['test3'],
            type: 'component',
          }),
        )

        const { result: sidebarResult } = renderHook(() =>
          useBadgesToDisplay({
            context: 'sidebar',
            parameters,
            tags: ['test3'],
            type: 'component',
          }),
        )

        expect(toolbarResult.current).toHaveLength(0)
        expect(mdxResult.current).toHaveLength(1)
        expect(mdxResult.current[0].badge).toEqual({ text: 'Test3' })
        expect(sidebarResult.current).toHaveLength(0)
      })

      it('only shows badges whose config matches the docs hash entry type', () => {
        const { result: toolbarResult } = renderHook(() =>
          useBadgesToDisplay({
            context: 'toolbar',
            parameters,
            tags: ['test3'],
            type: 'docs',
          }),
        )

        const { result: mdxResult } = renderHook(() =>
          useBadgesToDisplay({
            context: 'mdx',
            parameters,
            tags: ['test3'],
            type: 'docs',
          }),
        )

        const { result: sidebarResult } = renderHook(() =>
          useBadgesToDisplay({
            context: 'sidebar',
            parameters,
            tags: ['test3'],
            type: 'docs',
          }),
        )

        expect(toolbarResult.current).toHaveLength(1)
        expect(toolbarResult.current[0].badge).toEqual({ text: 'Test3' })
        expect(mdxResult.current).toHaveLength(0)
        expect(sidebarResult.current).toHaveLength(0)
      })
    })

    describe('output correctness', () => {
      it('handles function form of badge parameter', () => {
        const badgeFunction: BadgeOrBadgeFn = () => ({ text: 'Test Badge' })
        const parameters: TagBadgeParameters = [
          {
            tags: ['test'],
            badge: badgeFunction,
            display: { sidebar: true, toolbar: true },
          },
        ]

        const { result } = renderHook(() =>
          useBadgesToDisplay({
            context: 'sidebar',
            parameters,
            tags: ['test'],
            type: 'story',
          }),
        )

        expect(result.current).toHaveLength(1)
        expect(result.current[0].badge).toBe(badgeFunction)
        expect(result.current[0].tag).toBe('test')
      })

      it('does not return two badge entries for the same matched tag', () => {
        const parameters: TagBadgeParameters = [
          {
            tags: ['test'],
            badge: { text: 'Test Badge 1' },
            display: { sidebar: true, toolbar: true },
          },
          {
            tags: ['test'],
            badge: { text: 'Test Badge 2' },
            display: { sidebar: true, toolbar: true },
          },
        ]

        const { result } = renderHook(() =>
          useBadgesToDisplay({
            context: 'sidebar',
            parameters,
            tags: ['test'],
            type: 'story',
          }),
        )

        expect(result.current).toHaveLength(1)
        expect(result.current[0].badge).toEqual(parameters[0].badge)
      })
    })
  })

  describe('skipInherited', () => {
    const parameters: TagBadgeParameters = [
      {
        tags: ['test1'],
        badge: { text: 'Test1' },
        display: {
          sidebar: [{ type: 'story', skipInherited: false }],
        },
      },
      {
        tags: ['test2'],
        badge: { text: 'Test2' },
        display: {
          sidebar: [
            { type: 'story', skipInherited: true },
            { type: 'component', skipInherited: true },
          ],
        },
      },
      {
        tags: ['test3'],
        badge: { text: 'Test3' },
        display: {
          sidebar: [{ type: 'story', skipInherited: true }],
        },
      },
    ]

    beforeEach(() => {
      vi.clearAllMocks()
    })

    afterEach(() => {
      vi.resetAllMocks()
    })

    it('always displays tags when skipInherited is false', () => {
      const { result } = renderHook(() =>
        useBadgesToDisplay({
          context: 'sidebar',
          parameters,
          parent: 'mock-component',
          tags: ['test1'],
          type: 'story',
        }),
      )

      expect(result.current).toHaveLength(1)
      expect(result.current[0].tag).toBe('test1')
    })

    it('does not display tags when skipInherited is true and the parent displays it', () => {
      const { result } = renderHook(() =>
        useBadgesToDisplay({
          context: 'sidebar',
          parameters,
          parent: 'mock-component',
          tags: ['test2'],
          type: 'story',
        }),
      )

      expect(result.current).toHaveLength(0)
    })

    it('displays tags when skipInherited is true but the parent does not display it', () => {
      const { result } = renderHook(() =>
        useBadgesToDisplay({
          context: 'sidebar',
          parameters,
          parent: 'mock-component',
          tags: ['test3'],
          type: 'story',
        }),
      )

      expect(result.current).toHaveLength(1)
    })
  })

  describe.todo('Default config', () => {
    it('displays beta tags for components in the sidebar', () => {
      const { result } = renderHook(() =>
        useBadgesToDisplay({
          context: 'sidebar',
          parameters: defaultConfig,
          tags: ['beta'],
          type: 'component',
        }),
      )

      expect(result.current).toHaveLength(1)
      expect(result.current[0].tag).toBe('beta')
      expect(typeof result.current[0].badge).toBe('function')
    })
  })
})
