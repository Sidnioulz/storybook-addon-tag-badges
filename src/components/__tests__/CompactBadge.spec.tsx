import React, { type ReactNode, useLayoutEffect } from 'react'
import { render } from '@testing-library/react'
import { ThemeProvider, convert, themes } from 'storybook/theming/emotion'

import { CompactBadge } from '../CompactBadge'

// Runs a callback when its children are in the DOM, before the browser gets
// to paint them or to dispatch an event to them.
const OnceInTheDom = ({
  children,
  onceInTheDom,
}: {
  children: ReactNode
  onceInTheDom: () => void
}) => {
  useLayoutEffect(onceInTheDom, [onceInTheDom])
  return children
}

describe('CompactBadge', () => {
  it('listens to its row as soon as it is in the DOM', () => {
    const addEventListener = vi.spyOn(EventTarget.prototype, 'addEventListener')
    const listenedTo = (row: Element | null) =>
      addEventListener.mock.calls
        .filter((_, index) => addEventListener.mock.contexts[index] === row)
        .map(([type]) => type)
    let typesOnceInTheDom: string[] = []

    render(
      <ThemeProvider theme={convert(themes.light)}>
        <OnceInTheDom
          onceInTheDom={() => {
            typesOnceInTheDom = listenedTo(
              document.querySelector('[data-item-id]'),
            )
          }}
        >
          <div data-item-id="row">
            <CompactBadge extraStyle={{}} text="Deprecated" />
          </div>
        </OnceInTheDom>
      </ThemeProvider>,
    )

    // A pointer that enters the row right after it renders opens the badge:
    // the listeners don't wait for effects that run after the paint.
    expect(typesOnceInTheDom).toEqual(
      expect.arrayContaining(['pointerenter', 'pointerleave', 'keydown']),
    )
    addEventListener.mockRestore()
  })
})
