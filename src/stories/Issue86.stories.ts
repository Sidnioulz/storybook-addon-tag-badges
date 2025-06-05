import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'NRT/issue-86/Button',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
    onClick: fn(),
  },
  tags: ['dd-privacy:allow'],
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: {
    primary: true,
    label: 'Button',
  },
}

export const Secondary: Story = {
  args: {
    label: 'Button',
  },
}

export const Large: Story = {
  args: {
    size: 'large',
    label: 'Button',
  },
}

export const Medium: Story = {
  args: {
    size: 'medium',
    label: 'Button',
  },
}

export const MediumSizeButton: Story = {
  args: {
    size: 'medium',
    label: 'Button',
  },
}
MediumSizeButton.tags = ['deprecated']

export const Small: Story = {
  args: {
    size: 'small',
    label: 'Button',
  },
}
