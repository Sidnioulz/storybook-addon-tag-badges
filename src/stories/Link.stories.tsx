import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Link } from './Link'

const meta = {
  title: 'Navigation/Link',
  component: Link,
  tags: ['autodocs', 'qa:pass', 'version:1.0.0'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Link>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    href: '#',
    children: 'Default Link',
  },
}

export const Underline: Story = {
  args: {
    href: '#',
    children: 'Underlined Link',
    variant: 'underline',
  },
}

export const ButtonStyle: Story = {
  args: {
    href: '#',
    children: 'Button-style Link',
    variant: 'button',
  },
}

export const External: Story = {
  args: {
    href: 'https://example.com',
    children: 'External Link',
    external: true,
  },
}

export const Disabled: Story = {
  args: {
    href: '#',
    children: 'Disabled Link',
    disabled: true,
  },
}

export const DisabledButton: Story = {
  args: {
    href: '#',
    children: 'Disabled Button Link',
    variant: 'button',
    disabled: true,
  },
}

export const LongText: Story = {
  args: {
    href: '#',
    children:
      'This is a very long link text that demonstrates how the link component handles longer content that might wrap to multiple lines',
  },
}

export const WithIcon: Story = {
  args: {
    href: '#',
    children: (
      <>
        <span style={{ marginRight: '8px' }}>📎</span>
        Link with Icon
      </>
    ),
  },
}
