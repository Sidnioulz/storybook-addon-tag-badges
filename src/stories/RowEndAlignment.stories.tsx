import React, { type ReactNode, useRef, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { ROW_END_INSET, useRowEndAlignment } from '../utils/rowEndAlignment'

// Mimics a Storybook sidebar row: a label box that shrinks when trailing
// content (like the context menu button) appears next to it.
function AlignedLabel({ children }: Readonly<{ children: ReactNode }>) {
  const ref = useRef<HTMLDivElement>(null)
  useRowEndAlignment(ref)

  return (
    <div ref={ref} style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <span data-testid="badge" style={{ background: 'pink', padding: 2 }}>
        {children}
      </span>
    </div>
  )
}

const TRAILING_WIDTHS = [0, 24, 42]

function MockRow() {
  const [trailingWidth, setTrailingWidth] = useState(0)

  return (
    <div data-testid="mock">
      {TRAILING_WIDTHS.map((width) => (
        <button key={width} onClick={() => setTrailingWidth(width)}>
          {`Trailing content: ${width}px`}
        </button>
      ))}
      <div
        data-item-id="mock-row"
        style={{
          display: 'flex',
          alignItems: 'center',
          width: 280,
          height: 28,
          marginTop: 8,
          outline: '1px solid grey',
        }}
      >
        <span style={{ flex: '1 1 auto', minWidth: 0, overflow: 'hidden' }}>
          <AlignedLabel>Badge</AlignedLabel>
        </span>
        {trailingWidth > 0 && (
          <span
            style={{
              width: trailingWidth,
              flexShrink: 0,
              background: 'lightblue',
            }}
          />
        )}
      </div>
    </div>
  )
}

const meta: Meta<typeof MockRow> = {
  title: 'NRT/Row end alignment',
  component: MockRow,
}
export default meta
type Story = StoryObj<typeof MockRow>

export const KeepsBadgeAtRowEndInset: Story = {
  play: async ({ canvasElement }) => {
    // The preview decorator renders each story twice; test the first copy.
    const [mock] = within(canvasElement).getAllByTestId('mock')
    const row = mock.querySelector('[data-item-id="mock-row"]')!
    const badge = within(mock).getByTestId('badge')
    const getInset = () =>
      Math.round(
        row.getBoundingClientRect().right - badge.getBoundingClientRect().right,
      )
    const showTrailing = (width: number) =>
      userEvent.click(
        within(mock).getByRole('button', {
          name: `Trailing content: ${width}px`,
        }),
      )

    await waitFor(() => expect(getInset()).toBe(ROW_END_INSET))

    // Trailing content narrower than the inset doesn't move the badge.
    await showTrailing(24)
    await waitFor(() => expect(getInset()).toBe(ROW_END_INSET))

    // Wider trailing content pushes the badge to its left.
    await showTrailing(42)
    await waitFor(() => expect(getInset()).toBe(42))

    await showTrailing(0)
    await waitFor(() => expect(getInset()).toBe(ROW_END_INSET))
  },
}
