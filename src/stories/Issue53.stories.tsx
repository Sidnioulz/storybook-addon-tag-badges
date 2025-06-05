import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Badge } from '../components/Badge'

const meta: Meta<typeof Badge> = {
  title: 'NRT/issue-53/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
}
export default meta
type Story = StoryObj<typeof Badge>

export const TightSpace: Story = {
  args: {
    context: 'sidebar',
    text: 'Multi-word Badge',
  },
  tags: ['very-tight-space'],
  decorators: [
    (story) => (
      <div style={{ width: '60px', background: 'orange', overflow: 'hidden' }}>
        {story()}
      </div>
    ),
  ],
}

export const VeryTightSpaceWithNoSpaceForABadge: Story = {
  args: {
    context: 'sidebar',
    text: 'Multi-word Badge',
  },
  tags: ['very-tight-space'],
  decorators: [
    (story) => (
      <div style={{ width: '20px', background: 'red' }}>{story()}</div>
    ),
  ],
}
