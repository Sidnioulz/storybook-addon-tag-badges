import type { Meta, StoryObj } from '@storybook/react'
import { Avatar } from './Avatar'

const meta = {
  title: 'Display/Avatar',
  component: Avatar,
  tags: ['autodocs', 'qa:todo', 'version:1.0.0'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof Avatar>

export const WithImage: Story = {
  args: {
    src: 'https://i.pravatar.cc/300',
    alt: 'John Doe',
    size: 'medium',
  },
}

export const Small: Story = {
  args: {
    src: 'https://i.pravatar.cc/300',
    alt: 'John Doe',
    size: 'small',
  },
}

export const Large: Story = {
  args: {
    src: 'https://i.pravatar.cc/300',
    alt: 'John Doe',
    size: 'large',
  },
}

export const Fallback: Story = {
  args: {
    alt: 'John Doe',
    size: 'medium',
  },
}

export const CustomFallback: Story = {
  args: {
    fallback: 'CD',
    size: 'medium',
  },
}

export const BrokenImage: Story = {
  args: {
    src: 'broken-image-url',
    alt: 'John Doe',
    size: 'medium',
  },
}
