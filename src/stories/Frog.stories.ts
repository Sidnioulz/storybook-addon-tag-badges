import type { Meta, StoryObj } from '@storybook/react'
import { Frog } from './Frog'

const meta: Meta<typeof Frog> = {
  title: 'Example/Frog',
  component: Frog,
  argTypes: {},
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['frog'],
}

export default meta
type Story = StoryObj<typeof Frog>

export const Big: Story = {
  args: {
    size: 'big',
  },
}

export const Small: Story = {
  args: {
    size: 'small',
  },
}

export const AntEater: Story = {
  args: {
    preferredInsects: ['ants', 'termites'],
  },
}
