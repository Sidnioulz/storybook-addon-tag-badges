import React, { type ReactNode } from 'react'
import { render, screen } from '@testing-library/react'
import type { API_HashEntry } from 'storybook/internal/types'
import { ThemeProvider, convert, themes } from 'storybook/theming/emotion'

import { renderLabel } from '../renderLabel'
import { Sidebar } from '../components/Sidebar'
import type { TagBadgeParameters } from '../types/TagBadgeParameters'

const parameters: TagBadgeParameters = [
  {
    tags: 'new',
    badge: { text: 'New' },
    display: { sidebar: true },
  },
]

vi.mock('storybook/manager-api', () => ({
  addons: { getConfig: () => ({ tagBadges: parameters }) },
  useStorybookApi: () => ({ resolveStory: () => undefined }),
}))

const story = {
  id: 'example-button--primary',
  type: 'story',
  subtype: 'story',
  name: 'Primary',
  title: 'Example/Button',
  importPath: './Button.stories.tsx',
  tags: ['new'],
  depth: 2,
  parent: 'example-button',
  prepared: false,
} as unknown as API_HashEntry

const otherStory = {
  ...story,
  id: 'example-button--secondary',
  name: 'Secondary',
} as API_HashEntry

const root = {
  id: 'example',
  type: 'root',
  name: 'Example',
  tags: ['new'],
  depth: 0,
  children: [],
} as unknown as API_HashEntry

const withTheme = (ui: ReactNode) => (
  <ThemeProvider theme={convert(themes.light)}>{ui}</ThemeProvider>
)

describe('renderLabel', () => {
  it('calls no hooks, so a host may call it from any render', () => {
    // A hook called outside a component render throws.
    expect(() => renderLabel(story)).not.toThrow()
  })

  it('renders the label and the badge', () => {
    render(withTheme(renderLabel(story)))

    expect(screen.getByText('Primary')).toBeInTheDocument()
    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('keys the element with the entry id', () => {
    expect(renderLabel(story)?.key).toBe(story.id)
  })

  it('survives a host that renders a varying number of labels', () => {
    // Mirrors a host that maps over a changing list of entries in one render.
    const Host = ({ entries }: { entries: API_HashEntry[] }) => (
      <div>{entries.map((entry) => renderLabel(entry))}</div>
    )

    const { rerender } = render(withTheme(<Host entries={[]} />))
    expect(() => {
      rerender(withTheme(<Host entries={[story]} />))
      rerender(withTheme(<Host entries={[story, otherStory]} />))
      rerender(withTheme(<Host entries={[otherStory]} />))
    }).not.toThrow()
    expect(screen.getByText('Secondary')).toBeInTheDocument()
  })

  it('renders nothing for root entries', () => {
    expect(renderLabel(root)).toBeUndefined()
  })

  it('renders nothing in the mobile bottom bar, which only shows text', () => {
    expect(
      renderLabel(story, undefined, {
        isMobile: true,
        location: 'bottom-bar',
      }),
    ).toBeUndefined()
  })
})

describe('Sidebar', () => {
  it('renders its children without a badge for root entries', () => {
    render(withTheme(<Sidebar item={root}>Custom root</Sidebar>))

    expect(screen.getByText('Custom root')).toBeInTheDocument()
    expect(screen.queryByText('New')).not.toBeInTheDocument()
  })
})
