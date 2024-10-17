import type { Meta, StoryObj } from '@storybook/react'
import type { API_ComponentEntry } from '@storybook/types'

import { Badge, getBadgeProps } from './Badge'
import { defaultConfig } from '../defaultConfig'

const mockEntry: API_ComponentEntry = {
  type: 'component',
  id: 'foo',
  name: '',
  children: [],
  tags: [],
  depth: 0,
}

const meta: Meta<typeof Badge> = {
  title: 'Addon/Badge',
  component: Badge,
  argTypes: {
    bgColor: {
      control: 'color',
      description: 'Background colour, defaults to greyscale',
      type: 'string',
    },
    borderColor: {
      control: 'color',
      description: 'Background colour, optional',
      type: 'string',
    },
    fgColor: {
      control: 'color',
      description: 'Text colour, defaults to greyscale',
      type: 'string',
    },
    context: {
      control: 'select',
      options: ['sidebar', 'toolbar'],
      description: 'Whether the badge renders in the sidebar or toolbar',
    },
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {
  args: {
    context: 'toolbar',
    text: 'Text',
  },
}

export const Colors: Story = {
  args: {
    context: 'toolbar',
    text: 'Text',
    bgColor: 'hsl(110, 100%, 64%)',
    fgColor: 'hsl(110, 100%, 8%)',
  },
}

export const ColorAndBorders: Story = {
  args: {
    context: 'toolbar',
    text: 'Text',
    bgColor: 'hsl(110, 100%, 64%)',
    borderColor: 'hsl(110, 100%, 24%)',
    fgColor: 'hsl(110, 100%, 8%)',
  },
}

export const Tooltip: Story = {
  args: {
    context: 'toolbar',
    text: 'Text',
    tooltip: 'This badge has a tooltip!',
  },
}

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
