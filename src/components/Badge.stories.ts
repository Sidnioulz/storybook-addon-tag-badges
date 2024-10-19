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
