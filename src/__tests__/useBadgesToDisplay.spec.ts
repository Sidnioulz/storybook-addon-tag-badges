import { renderHook } from '@testing-library/react'

import { useBadgesToDisplay } from '../useBadgesToDisplay'
import { TagBadgeParameters } from '../types/TagBadgeParameters'
import { BadgeOrBadgeFn } from '../types/Badge'
import { defaultConfig } from '../defaultConfig'

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

      it.todo(
        'only shows badges whose config matches the story hash entry type',
        () => {},
      )

      it.todo(
        'only shows badges whose config matches the component hash entry type',
        () => {},
      )

      it.todo(
        'only shows badges whose config matches the docs hash entry type',
        () => {},
      )
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
