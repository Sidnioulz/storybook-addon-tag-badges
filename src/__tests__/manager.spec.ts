import type { API_SidebarOptions } from 'storybook/internal/types'

import { renderAriaLabel } from '../renderAriaLabel'
import { renderLabel } from '../renderLabel'

const manager = vi.hoisted(() => ({
  config: {} as Record<string, unknown>,
  register: undefined as ((api: unknown) => void) | undefined,
  setConfig: vi.fn(),
}))

vi.mock('storybook/manager-api', () => ({
  addons: {
    add: vi.fn(),
    getConfig: () => manager.config,
    register: (_id: string, callback: (api: unknown) => void) => {
      manager.register = callback
    },
    setConfig: manager.setConfig,
  },
  types: { TOOL: 'tool' },
}))

await import('../manager')

function registerWith(sidebar?: API_SidebarOptions) {
  manager.config = { sidebar }
  manager.setConfig.mockClear()
  manager.register!({ on: vi.fn(), emit: vi.fn() })
  return manager.setConfig.mock.calls[0][0].sidebar as API_SidebarOptions
}

describe('manager registration', () => {
  it('sets the sidebar label and aria label', () => {
    const sidebar = registerWith()

    expect(sidebar.renderLabel).toBe(renderLabel)
    expect(sidebar.renderAriaLabel).toBe(renderAriaLabel)
  })

  it("leaves a custom label's aria label to its author", () => {
    const customLabel = () => 'Custom'
    const sidebar = registerWith({ renderLabel: customLabel })

    expect(sidebar.renderLabel).toBe(customLabel)
    expect(sidebar.renderAriaLabel).toBeUndefined()
  })

  it("sets the aria label alongside the addon's own label", () => {
    const sidebar = registerWith({ renderLabel })

    expect(sidebar.renderAriaLabel).toBe(renderAriaLabel)
  })

  it('keeps an aria label set by the user', () => {
    const customAriaLabel = () => 'Custom'
    const sidebar = registerWith({ renderAriaLabel: customAriaLabel })

    expect(sidebar.renderLabel).toBe(renderLabel)
    expect(sidebar.renderAriaLabel).toBe(customAriaLabel)
  })
})
