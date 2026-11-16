import { readOptions } from '../utils/config'

vi.mock('storybook/manager-api', () => ({
  addons: {
    getConfig: () => ({ tagBadgesOptions: { compactSidebar: false } }),
  },
}))

describe('readOptions', () => {
  it('returns no options when none are set', () => {
    expect(readOptions({})).toEqual({})
  })

  it('returns the options set in tagBadgesOptions', () => {
    expect(readOptions({ tagBadgesOptions: { compactSidebar: true } })).toEqual(
      { compactSidebar: true },
    )
  })

  it('reads the manager config by default', () => {
    expect(readOptions()).toEqual({ compactSidebar: false })
  })
})
