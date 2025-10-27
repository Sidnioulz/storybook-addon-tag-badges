import type { Meta, StoryObj } from '@storybook/react-vite'

import { Badge, getBadgeProps } from '../components/Badge'
import { defaultConfig } from '../defaultConfig'
import { mockEntry } from './__fixtures__/HashEntry'

const meta: Meta<typeof Badge> = {
  title: 'Addon/Default Config',
  component: Badge,
  tags: ['autodocs', 'flaky'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof Badge>

export const PresetNew: Story = {
  args: getBadgeProps(defaultConfig[0].badge, mockEntry, 'new', 'toolbar'),
}
export const PresetAlpha: Story = {
  args: getBadgeProps(defaultConfig[1].badge, mockEntry, 'alpha', 'toolbar'),
}
export const PresetBeta: Story = {
  args: getBadgeProps(defaultConfig[1].badge, mockEntry, 'beta', 'toolbar'),
}
export const PresetRC: Story = {
  args: getBadgeProps(defaultConfig[1].badge, mockEntry, 'rc', 'toolbar'),
}
export const PresetExperimental: Story = {
  args: getBadgeProps(
    defaultConfig[1].badge,
    mockEntry,
    'experimental',
    'toolbar',
  ),
}
export const PresetDeprecated: Story = {
  args: getBadgeProps(
    defaultConfig[2].badge,
    mockEntry,
    'deprecated',
    'toolbar',
  ),
}
export const PresetOutdated: Story = {
  args: getBadgeProps(defaultConfig[3].badge, mockEntry, 'outdated', 'toolbar'),
}
export const PresetDanger: Story = {
  args: getBadgeProps(defaultConfig[4].badge, mockEntry, 'danger', 'toolbar'),
}
export const PresetCodeOnly: Story = {
  args: getBadgeProps(
    defaultConfig[5].badge,
    mockEntry,
    'code-only',
    'toolbar',
  ),
}
export const PresetVersion: Story = {
  args: getBadgeProps(
    defaultConfig[6].badge,
    mockEntry,
    'version:1.0.0',
    'toolbar',
  ),
}
export const PresetExperimentalVersion: Story = {
  args: getBadgeProps(
    defaultConfig[6].badge,
    mockEntry,
    'version:0.2.1',
    'toolbar',
  ),
}
