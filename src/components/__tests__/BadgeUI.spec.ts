import { convert, themes } from 'storybook/theming/emotion'

import { getBadgeBorder } from '../BadgeUI'

describe('getBadgeBorder', () => {
  it('draws the border colour of a badge', () => {
    expect(getBadgeBorder(convert(themes.dark), { borderColor: 'red' })).toBe(
      'inset 0 0 0 1px red',
    )
  })

  it('returns valid shadows for a dark badge without a border colour', () => {
    expect(getBadgeBorder(convert(themes.dark), {})).toBe('none')
  })

  it('derives a faint border from the text colour of a light badge', () => {
    expect(getBadgeBorder(convert(themes.light), { color: 'red' })).toBe(
      'inset 0 0 0 1px color-mix(in oklab, red 10%, transparent 90%)',
    )
  })
})
