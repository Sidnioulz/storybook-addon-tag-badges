import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '../Button'

const meta: Meta<typeof Button> = {
  title: 'NRT/issue-102-a/Group/Button',
  component: Button,
  tags: ['frog'],
}

export default meta
type Story = StoryObj<typeof Button>

export const Base: Story = {
  args: {
    primary: true,
    label: 'Button',
  },
}
