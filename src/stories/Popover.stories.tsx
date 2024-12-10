import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Popover } from './Popover'

const meta = {
  title: 'Overlay/Popover',
  component: Popover,
  tags: ['autodocs', 'qa:pass', 'version:1.0.0'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

const PopoverContent = () => (
  <div style={{ padding: '8px' }}>
    <h4 style={{ margin: '0 0 8px 0' }}>Popover Title</h4>
    <p style={{ margin: '0' }}>This is the popover content.</p>
  </div>
)

const TriggerButton = ({ children }: { children: React.ReactNode }) => (
  <button
    style={{
      padding: '8px 16px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      backgroundColor: 'white',
      cursor: 'pointer',
    }}
  >
    {children}
  </button>
)

export const Bottom: Story = {
  args: {
    isOpen: true,
    placement: 'bottom',
    trigger: <TriggerButton>Click me</TriggerButton>,
    children: <PopoverContent />,
    onClose: () => console.log('Popover closed'),
  },
}

export const Top: Story = {
  args: {
    isOpen: true,
    placement: 'top',
    trigger: <TriggerButton>Click me</TriggerButton>,
    children: <PopoverContent />,
    onClose: () => console.log('Popover closed'),
  },
}

export const Left: Story = {
  args: {
    isOpen: true,
    placement: 'left',
    trigger: <TriggerButton>Click me</TriggerButton>,
    children: <PopoverContent />,
    onClose: () => console.log('Popover closed'),
  },
}

export const Right: Story = {
  args: {
    isOpen: true,
    placement: 'right',
    trigger: <TriggerButton>Click me</TriggerButton>,
    children: <PopoverContent />,
    onClose: () => console.log('Popover closed'),
  },
}

const MenuContent = () => (
  <div style={{ padding: '8px' }}>
    <ul
      style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}
    >
      <li>
        <button
          style={{
            width: '100%',
            textAlign: 'left',
            padding: '8px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderRadius: '4px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f5f5f5'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          Edit
        </button>
      </li>
      <li>
        <button
          style={{
            width: '100%',
            textAlign: 'left',
            padding: '8px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderRadius: '4px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f5f5f5'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          Duplicate
        </button>
      </li>
      <li>
        <button
          style={{
            width: '100%',
            textAlign: 'left',
            padding: '8px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderRadius: '4px',
            color: '#dc3545',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f5f5f5'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          Delete
        </button>
      </li>
    </ul>
  </div>
)

export const AsMenu: Story = {
  args: {
    isOpen: true,
    placement: 'bottom',
    trigger: (
      <button
        style={{
          padding: '4px 8px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          backgroundColor: 'white',
          cursor: 'pointer',
        }}
      >
        ⋮
      </button>
    ),
    children: <MenuContent />,
    onClose: () => console.log('Menu closed'),
  },
}
