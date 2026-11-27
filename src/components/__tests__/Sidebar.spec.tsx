import React from 'react'
import { render, screen } from '@testing-library/react'
import type { API_HashEntry } from 'storybook/internal/types'
import { ThemeProvider, convert, themes } from 'storybook/theming/emotion'

import { Sidebar } from '../Sidebar'

const manager = vi.hoisted(() => ({
  config: {} as Record<string, unknown>,
  hash: {} as Record<string, unknown>,
}))

vi.mock('storybook/manager-api', () => ({
  addons: { getConfig: () => manager.config },
  useStorybookApi: () => ({
    resolveStory: (id: string) => manager.hash[id],
  }),
}))

// A component whose meta sets `new`, which Storybook gives it, and one of
// whose stories removes it.
const foo = {
  id: 'foo',
  type: 'component',
  name: 'Foo',
  tags: ['dev', 'test', 'new'],
  depth: 0,
  children: ['foo--one', 'foo--five-old'],
} as unknown as API_HashEntry
const one = {
  id: 'foo--one',
  type: 'story',
  subtype: 'story',
  name: 'One',
  tags: ['dev', 'test', 'new'],
  depth: 1,
  parent: 'foo',
} as unknown as API_HashEntry
const fiveOld = {
  id: 'foo--five-old',
  type: 'story',
  subtype: 'story',
  name: 'Five Old',
  tags: ['dev', 'test'],
  depth: 1,
  parent: 'foo',
} as unknown as API_HashEntry

const renderRows = () =>
  render(
    <ThemeProvider theme={convert(themes.light)}>
      {[foo, one, fiveOld].map((item) => (
        <div data-testid={item.id} key={item.id}>
          <Sidebar item={item}>{item.name}</Sidebar>
        </div>
      ))}
    </ThemeProvider>,
  )

const rowText = (id: string) => screen.getByTestId(id).textContent

describe('Sidebar', () => {
  beforeEach(() => {
    manager.config = {}
    manager.hash = { foo, 'foo--one': one, 'foo--five-old': fiveOld }
  })

  it('shows the badges of the tags Storybook gives a component by default', () => {
    renderRows()

    expect(rowText('foo')).toBe('FooNew')
    expect(rowText('foo--one')).toBe('One')
    expect(rowText('foo--five-old')).toBe('Five Old')
  })

  it('leaves a badge to the stories of a component when one of them lacks its tag, with legacyTagIntersection', () => {
    manager.config = { tagBadgesOptions: { legacyTagIntersection: true } }

    renderRows()

    expect(rowText('foo')).toBe('Foo')
    expect(rowText('foo--one')).toBe('OneNew')
    expect(rowText('foo--five-old')).toBe('Five Old')
  })
})
