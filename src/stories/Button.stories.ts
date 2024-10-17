import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'

import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Example/Button',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
    onClick: fn(),
  },
  parameters: {
    docs: {
      tags: ['new'],
    },
  },
  tags: ['autodocs', 'rc', 'version:1.0.0rc'],
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

export const Small: Story = {
  args: {
    size: 'small',
    label: 'Button',
  },
}
