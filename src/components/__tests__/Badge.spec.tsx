import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { ThemeProvider, convert, themes } from '@storybook/theming'
import type { HashEntry } from '@storybook/manager-api'

import { Badge, WithBadge } from '../Badge'
import { getTagParts } from '../../utils/tag'

const mockEntry: HashEntry = {
  id: 'example-story',
  type: 'story',
  title: 'Example/Story',
  importPath: './example.stories.tsx',
  tags: ['example', 'story'],
  name: 'Example Story',
  prepared: true,
  args: {},
  argTypes: {},
  initialArgs: {},
  parameters: {},
  depth: 0,
  parent: '',
}

const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider theme={convert(themes.dark)}>{ui}</ThemeProvider>,
  )
}

describe('Badge', () => {
  describe('Badge component', () => {
    it('renders with basic props', () => {
      renderWithTheme(<Badge context="sidebar" text="Test Badge" />)
      expect(screen.getByText('Test Badge')).toBeInTheDocument()
    })

    it('renders in sidebar context', () => {
      renderWithTheme(<Badge context="sidebar" text="Sidebar Badge" />)
      const badge = screen.getByText('Sidebar Badge')
      expect(badge).toBeInTheDocument()
    })

    it('renders in toolbar context', () => {
      renderWithTheme(<Badge context="toolbar" text="Toolbar Badge" />)
      const badge = screen.getByText('Toolbar Badge')
      expect(badge).toBeInTheDocument()
    })

    it('renders as a button in the toolbar when tooltip is set as string', async () => {
      const text = 'Tooltip Badge'
      const tooltip = 'This is a tooltip'
      renderWithTheme(<Badge context="toolbar" text={text} tooltip={tooltip} />)

      const badge = await screen.findByText(text)
      expect(badge).toBeInTheDocument()
      expect(badge.tagName).toBe('BUTTON')
    })

    it('renders as a button in the toolbar when tooltip is set as TooltipMessage props', async () => {
      const text = 'Tooltip Badge'
      const tooltip = {
        title: 'Tooltip Title',
        desc: 'Tooltip Description',
      }
      renderWithTheme(<Badge context="toolbar" text={text} tooltip={tooltip} />)

      const badge = await screen.findByText(text)
      expect(badge).toBeInTheDocument()
      expect(badge.tagName).toBe('BUTTON')
    })

    it('ignores tooltip in the sidebar', async () => {
      const text = 'Tooltip Badge'
      const tooltip = 'This is a tooltip'
      renderWithTheme(<Badge context="sidebar" text={text} tooltip={tooltip} />)

      const badge = await screen.findByText(text)
      expect(badge).toBeInTheDocument()
      expect(badge.tagName).not.toBe('BUTTON')
    })

    it('renders with custom colors', () => {
      renderWithTheme(
        <Badge
          context="sidebar"
          text="Custom Colors"
          bgColor="#ff0000"
          borderColor="#00ff00"
          fgColor="#0000ff"
        />,
      )
      const badge = screen.getByText('Custom Colors')
      expect(badge).toHaveStyle({
        background: '#ff0000',
        color: '#0000ff',
        'box-shadow': 'inset 0 0 0 1px #00ff00',
      })
    })
  })

  describe('WithBadge component', () => {
    it('renders with a basic config object', () => {
      const config = {
        text: 'Config Badge',
        bgColor: '#cccccc',
      }
      renderWithTheme(
        <WithBadge
          config={config}
          entry={mockEntry}
          tag="test"
          context="sidebar"
        />,
      )
      const badge = screen.getByText('Config Badge')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveStyle({ background: '#cccccc' })
    })

    it('renders with a config function', () => {
      const configFn = vi.fn()
      configFn.mockImplementation(
        ({ entry, tag }: { entry: HashEntry; tag: string }) => ({
          text: `${entry.type}-${tag}`,
          bgColor: '#eeeeee',
        }),
      )
      renderWithTheme(
        <WithBadge
          config={configFn}
          entry={mockEntry}
          tag="test"
          context="sidebar"
        />,
      )
      const badge = screen.getByText('story-test')
      expect(configFn).toHaveBeenCalledWith(
        expect.objectContaining({ getTagParts }),
      )
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveStyle({ background: '#eeeeee' })
    })
  })
})
