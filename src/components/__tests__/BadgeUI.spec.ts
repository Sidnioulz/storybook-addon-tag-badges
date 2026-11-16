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

  it('can be combined with other shadows when there is no border', () => {
    expect(
      [getBadgeBorder(convert(themes.dark), {}), '0 0 0 2px white']
        .filter((shadow) => shadow !== 'none')
        .join(', '),
    ).toBe('0 0 0 2px white')
  })
})
