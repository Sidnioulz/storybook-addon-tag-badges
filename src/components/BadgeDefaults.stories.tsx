import type { Meta, StoryObj } from '@storybook/react'

import { Badge, getBadgeProps } from './Badge'
import { defaultConfig } from '../defaultConfig'
import { mockEntry } from '../examples/__fixtures__/HashEntry'

const meta: Meta<typeof Badge> = {
  title: 'Addon/Default Config',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof Badge>

export const PresetNew: Story = {
  args: getBadgeProps(defaultConfig[0].badge, mockEntry, 'new'),
}
export const PresetAlpha: Story = {
  args: getBadgeProps(defaultConfig[1].badge, mockEntry, 'alpha'),
}
export const PresetBeta: Story = {
  args: getBadgeProps(defaultConfig[1].badge, mockEntry, 'beta'),
}
export const PresetRC: Story = {
  args: getBadgeProps(defaultConfig[1].badge, mockEntry, 'rc'),
}
export const PresetExperimental: Story = {
  args: getBadgeProps(defaultConfig[1].badge, mockEntry, 'experimental'),
}
export const PresetDeprecated: Story = {
  args: getBadgeProps(defaultConfig[2].badge, mockEntry, 'deprecated'),
}
export const PresetOutdated: Story = {
  args: getBadgeProps(defaultConfig[3].badge, mockEntry, 'outdated'),
}
export const PresetDanger: Story = {
  args: getBadgeProps(defaultConfig[4].badge, mockEntry, 'danger'),
}
export const PresetCodeOnly: Story = {
  args: getBadgeProps(defaultConfig[5].badge, mockEntry, 'code-only'),
}
export const PresetVersion: Story = {
  args: getBadgeProps(defaultConfig[6].badge, mockEntry, 'version:1.0.0'),
}
