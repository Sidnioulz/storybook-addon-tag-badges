import type { Meta, StoryObj } from '@storybook/react'

import { Badge } from '../components/Badge'

const meta: Meta<typeof Badge> = {
  title: 'Addon/Badge',
  component: Badge,
  argTypes: {
    bgColor: {
      control: 'color',
      description: 'Background colour, defaults to greyscale',
      type: 'string',
    },
    borderColor: {
      control: 'color',
      description: 'Background colour, optional',
      type: 'string',
    },
    fgColor: {
      control: 'color',
      description: 'Text colour, defaults to greyscale',
      type: 'string',
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
    bgColor: 'hsl(110, 100%, 64%)',
    fgColor: 'hsl(110, 100%, 8%)',
  },
}

export const ColorAndBorders: Story = {
  args: {
    context: 'toolbar',
    text: 'Text',
    bgColor: 'hsl(110, 100%, 64%)',
    borderColor: 'hsl(110, 100%, 24%)',
    fgColor: 'hsl(110, 100%, 8%)',
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
