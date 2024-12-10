import type { Meta, StoryObj, StoryFn } from '@storybook/react'
import React from 'react'
import { VisuallyHidden } from './VisuallyHidden'

const meta = {
  title: 'Accessibility/VisuallyHidden',
  component: VisuallyHidden,
  tags: ['autodocs', 'qa:todo', 'version:1.0.0'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof VisuallyHidden>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'This text is only visible to screen readers',
  },
  decorators: [
    (Story: StoryFn) => (
      <div>
        <p>
          The text below is visually hidden but accessible to screen readers:
        </p>
        <Story />
        <p>Content after the visually hidden text</p>
      </div>
    ),
  ],
}

export const WithButton: Story = {
  args: {
    children: 'Skip to main content',
  },
  decorators: [
    (Story: StoryFn) => (
      <button>
        <Story />
        <span aria-hidden="true">→</span>
      </button>
    ),
  ],
}
