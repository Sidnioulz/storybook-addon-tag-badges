import type { Meta, StoryObj } from '@storybook/react'

import { Badge } from './Badge'

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
    text: 'New',
  },
}

export const Colors: Story = {
  args: {
    context: 'toolbar',
    text: 'New',
    bgColor: 'hsl(164, 100%, 64%)',
    fgColor: 'hsl(164, 100%, 8%)',
  },
}

export const ColorAndBorders: Story = {
  args: {
    context: 'toolbar',
    text: 'New',
    bgColor: 'hsl(164, 100%, 64%)',
    borderColor: 'hsl(164, 100%, 24%)',
    fgColor: 'hsl(164, 100%, 8%)',
  },
}

export const Tooltip: Story = {
  args: {
    context: 'toolbar',
    text: 'New',
    tooltip: 'This component is new!',
  },
}
