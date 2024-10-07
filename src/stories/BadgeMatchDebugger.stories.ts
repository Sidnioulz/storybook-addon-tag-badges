import type { Meta, StoryObj } from '@storybook/react'

import { BadgeMatchDebugger } from '../components/BadgeMatchDebugger'
import { defaultConfig } from '../defaultConfig'

const meta: Meta<typeof BadgeMatchDebugger> = {
  title: 'Addon/BadgeMatchDebugger',
  component: BadgeMatchDebugger,
  argTypes: {
    // TODO
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof BadgeMatchDebugger>

export const Default: Story = {
  args: {
    tags: ['foo', 'bar'],
    parameters: defaultConfig,
  },
}
