import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Modal } from './Modal'

const meta = {
  title: 'Overlay/Modal',
  component: Modal,
  tags: ['autodocs', 'qa:pass', 'version:1.0.0'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

const ExampleContent = () => (
  <div
    style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      minWidth: '300px',
    }}
  >
    <h2>Example Modal Content</h2>
    <p>This demonstrates the headless modal functionality.</p>
    <button>Focusable element</button>
  </div>
)

export const Default: Story = {
  args: {
    isOpen: true,
    children: <ExampleContent />,
    onClose: () => console.log('Modal closed'),
  },
}

const CustomPositionContent = () => (
  <div
    style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: 'white',
      padding: '16px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      maxWidth: '300px',
    }}
  >
    <h3>Custom Position</h3>
    <p>Modal content can be positioned anywhere.</p>
    <button>Close</button>
  </div>
)

export const CustomPosition: Story = {
  args: {
    isOpen: true,
    children: <CustomPositionContent />,
    onClose: () => console.log('Modal closed'),
  },
}

const NestedFocusContent = () => {
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        minWidth: '300px',
      }}
    >
      <h2>Focus Management</h2>
      <p>The first button will receive initial focus.</p>
      <button ref={buttonRef}>First Button</button>
      <button>Second Button</button>
      <button>Third Button</button>
    </div>
  )
}

export const WithInitialFocus: Story = {
  args: {
    isOpen: true,
    children: <NestedFocusContent />,
    initialFocus: React.useRef<HTMLButtonElement>(null),
    onClose: () => console.log('Modal closed'),
  },
}
