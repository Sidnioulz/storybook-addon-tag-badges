import type { Meta, StoryObj } from '@storybook/react-vite'

import { Frog } from '../Frog'

const meta: Meta<typeof Frog> = {
  title: 'NRT/issue-102-b',
  component: Frog,
  tags: ['autodocs', 'frog'],
}

export default meta
type Story = StoryObj<typeof Frog>

export const Base: Story = {}
