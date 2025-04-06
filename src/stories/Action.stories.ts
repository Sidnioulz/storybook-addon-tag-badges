import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Example/Action',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
    onClick: fn(),
  },
  tags: ['code-only'],
}

export default meta
type Story = StoryObj<typeof Button>

export const Action: Story = {
  args: {
    primary: true,
    label: 'Button',
    size: 'large',
  },
}
