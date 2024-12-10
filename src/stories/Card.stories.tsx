import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Card } from './Card'

const meta = {
  title: 'Data Display/Card',
  component: Card,
  tags: ['autodocs', 'qa:pass', 'version:1.0.0'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

const ExampleContent = () => (
  <div style={{ width: '300px' }}>
    <p style={{ margin: 0 }}>
      This is some example content that demonstrates how the card component
      handles content of varying lengths and types.
    </p>
  </div>
)

export const Default: Story = {
  args: {
    children: <ExampleContent />,
  },
}

export const WithTitle: Story = {
  args: {
    title: 'Card Title',
    children: <ExampleContent />,
  },
}

export const WithTitleAndSubtitle: Story = {
  args: {
    title: 'Card Title',
    subtitle: 'A brief description of the card content',
    children: <ExampleContent />,
  },
}

export const WithFooter: Story = {
  args: {
    title: 'Card Title',
    children: <ExampleContent />,
    footer: (
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <button>Cancel</button>
        <button>Save</button>
      </div>
    ),
  },
}

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    title: 'Outlined Card',
    children: <ExampleContent />,
  },
}

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    title: 'Elevated Card',
    children: <ExampleContent />,
  },
}

export const SmallPadding: Story = {
  args: {
    padding: 'small',
    title: 'Small Padding',
    children: <ExampleContent />,
  },
}

export const LargePadding: Story = {
  args: {
    padding: 'large',
    title: 'Large Padding',
    children: <ExampleContent />,
  },
}

export const NoPadding: Story = {
  args: {
    padding: 'none',
    children: (
      <img
        src="https://picsum.photos/300/200"
        alt="Random"
        style={{ display: 'block', width: '100%', height: 'auto' }}
      />
    ),
  },
}

export const ComplexContent: Story = {
  args: {
    title: 'User Profile',
    subtitle: 'Personal Information',
    children: (
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          👤
        </div>
        <div>
          <h4 style={{ margin: '0 0 4px 0' }}>John Doe</h4>
          <p style={{ margin: '0', color: '#666' }}>john.doe@example.com</p>
          <p style={{ margin: '4px 0 0 0', color: '#666' }}>
            Software Engineer
          </p>
        </div>
      </div>
    ),
    footer: (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>Member since 2023</span>
        <button>Edit Profile</button>
      </div>
    ),
  },
}

export const Loading: Story = {
  args: {
    title: 'Loading State',
    children: (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px',
          backgroundColor: '#f5f5f5',
        }}
      >
        Loading...
      </div>
    ),
  },
}
