import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Example/Button',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
    onClick: fn(),
  },
  tags: ['autodocs', 'frog', 'version:1.0.0'],
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
Medium.tags = ['deprecated']

export const Small: Story = {
  args: {
    size: 'small',
    label: 'Button',
  },
}
