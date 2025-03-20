import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Badge } from '../components/Badge'

const meta: Meta<typeof Badge> = {
  title: 'Addon/Badge',
  component: Badge,
  argTypes: {
    style: {
      control: 'select',
      options: [
        'grey',
        'green',
        'turquoise',
        'blue',
        'purple',
        'pink',
        'red',
        'orange',
        'yellow',
      ],
      description:
        'Color preset (a CSS object can also be passed for more customisation)',
    },
    context: {
      control: 'select',
      options: ['sidebar', 'toolbar'],
      description: 'Whether the badge renders in the sidebar or toolbar',
    },
    tooltip: {
      description: 'Tooltip content; either as string or TooltipMessage props',
      control: false,
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
    style: {
      backgroundColor: 'hsl(110, 100%, 64%)',
      color: 'hsl(110, 100%, 8%)',
    },
  },
}

export const ColorAndBorders: Story = {
  args: {
    context: 'toolbar',
    text: 'Text',
    style: {
      backgroundColor: 'hsl(110, 100%, 64%)',
      borderColor: 'hsl(110, 100%, 24%)',
      color: 'hsl(110, 100%, 8%)',
    },
  },
}

export const SimpleTooltip: Story = {
  args: {
    context: 'toolbar',
    text: 'Text',
    tooltip: 'This badge has a simple string tooltip!',
  },
}

export const RichTooltip: Story = {
  args: {
    context: 'toolbar',
    text: 'Text',
    tooltip: {
      title: 'Rich Tooltip',
      desc: 'This badge uses a TooltipMessage component with title and description',
    },
  },
}

export const RichTooltipWithLink: Story = {
  args: {
    context: 'toolbar',
    text: 'Text',
    tooltip: {
      title: 'Rich Tooltip',
      desc: 'This badge uses a TooltipMessage component with title and description',
      links: [
        {
          title: 'Storybook',
          href: 'https://storybook.js.org/',
        },
      ],
    },
  },
}

export const SidebarBadge: Story = {
  args: {
    context: 'sidebar',
    text: 'Text',
    tooltip: 'Tooltips are disabled in the sidebar',
  },
}

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
