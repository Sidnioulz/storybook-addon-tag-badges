import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Button } from './Button'

const meta = {
  title: 'Actions/Button',
  component: Button,
  tags: ['autodocs', 'qa:pass', 'version:1.1.4'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
}

export const Small: Story = {
  args: {
    size: 'small',
    children: 'Small Button',
  },
}

export const Medium: Story = {
  args: {
    size: 'medium',
    children: 'Medium Button',
  },
}

export const Large: Story = {
  args: {
    size: 'large',
    children: 'Large Button',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
}

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <span style={{ marginRight: '8px' }}>★</span>
        Button with Icon
      </>
    ),
  },
}

export const Loading: Story = {
  args: {
    disabled: true,
    children: (
      <>
        <span
          style={{
            display: 'inline-block',
            marginRight: '8px',
            animation: 'spin 1s linear infinite',
          }}
        >
          ⟳
        </span>
        Loading...
      </>
    ),
  },
}

export const FullWidth: Story = {
  args: {
    children: 'Full Width Button',
    style: { width: '100%' },
  },
}
