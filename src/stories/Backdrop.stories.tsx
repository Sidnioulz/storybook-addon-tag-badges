import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Backdrop } from './Backdrop'

const meta = {
  title: 'Overlay/Backdrop',
  component: Backdrop,
  tags: ['autodocs', 'qa:fail', 'version:1.0.0'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Backdrop>

export default meta
type Story = StoryObj<typeof Backdrop>

export const Default: Story = {
  args: {
    open: true,
    onClick: () => console.log('Backdrop clicked'),
  },
}

export const WithContent: Story = {
  args: {
    open: true,
    onClick: () => console.log('Backdrop clicked'),
    children: (
      <div
        style={{
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        Content on top of backdrop
      </div>
    ),
  },
}

export const Hidden: Story = {
  args: {
    open: false,
    onClick: () => console.log('Backdrop clicked'),
  },
}
