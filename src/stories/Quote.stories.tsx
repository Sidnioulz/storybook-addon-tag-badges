import type { Meta, StoryObj } from '@storybook/react'
import { Quote } from './Quote'

const meta = {
  title: 'Display/Quote',
  component: Quote,
  tags: ['autodocs', 'outdated', 'qa:pass', 'version:1.3.1'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Quote>

export default meta
type Story = StoryObj<typeof Quote>

export const Default: Story = {
  args: {
    text: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
  },
}

export const WithCitation: Story = {
  args: {
    text: 'Be the change you wish to see in the world.',
    author: 'Mahatma Gandhi',
    citation: 'Speech in South Africa, 1890',
  },
}

export const TextOnly: Story = {
  args: {
    text: 'Life is what happens while you are busy making other plans.',
  },
}
