import preview from '#.storybook/preview'
import { expect } from 'storybook/test'

import { Badge } from '../components/Badge'

const meta = preview.meta({
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
})

export const Default = meta.story({
  args: {
    context: 'toolbar',
    text: 'Text',
  },
})

export const Colors = meta.story({
  args: {
    context: 'toolbar',
    text: 'Text',
    style: {
      backgroundColor: 'hsl(110, 100%, 64%)',
      color: 'hsl(110, 100%, 8%)',
    },
  },
})

Colors.test('looks green', () => {
  expect(document.querySelector('div')).toHaveStyle({
    backgroundColor: 'hsl(110, 100%, 64%)',
    color: 'hsl(110, 100%, 8%)',
  })
})

Colors.test('looks stunning', () => {
  expect(document.querySelector('div')).toHaveStyle({
    backgroundColor: 'hsl(110, 100%, 64%)',
    color: 'hsl(110, 100%, 8%)',
  })
})

Colors.test(
  'looks clean',
  {
    tags: ['flaky'],
  },
  () => {
    expect(document.querySelector('div')).toHaveStyle({
      backgroundColor: 'hsl(110, 100%, 64%)',
      color: 'hsl(110, 100%, 8%)',
    })
  },
)

export const ColorAndBorders = meta.story({
  args: {
    context: 'toolbar',
    text: 'Text',
    style: {
      backgroundColor: 'hsl(110, 100%, 64%)',
      borderColor: 'hsl(110, 100%, 24%)',
      color: 'hsl(110, 100%, 8%)',
    },
  },
})

export const SimpleTooltip = meta.story({
  args: {
    context: 'toolbar',
    text: 'Text',
    tooltip: 'This badge has a simple string tooltip!',
  },
})

export const RichTooltip = meta.story({
  args: {
    context: 'toolbar',
    text: 'Text',
    tooltip: {
      title: 'Rich Tooltip',
      desc: 'This badge uses a TooltipMessage component with title and description',
    },
  },
})

export const RichTooltipWithLink = meta.story({
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
})

export const SidebarBadge = meta.story({
  args: {
    context: 'sidebar',
    text: 'Text',
    tooltip: 'Tooltips are disabled in the sidebar',
  },
})
