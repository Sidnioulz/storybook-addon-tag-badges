import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Dialog } from './Dialog'

const meta = {
  title: 'Overlay/Dialog',
  component: Dialog,
  tags: ['autodocs', 'qa:pass', 'version:1.0.0'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

const DefaultFooter = () => (
  <>
    <button
      onClick={() => console.log('Cancel clicked')}
      style={{
        padding: '8px 16px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        backgroundColor: 'white',
        cursor: 'pointer',
      }}
    >
      Cancel
    </button>
    <button
      onClick={() => console.log('Confirm clicked')}
      style={{
        padding: '8px 16px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#007bff',
        color: 'white',
        cursor: 'pointer',
      }}
    >
      Confirm
    </button>
  </>
)

export const Small: Story = {
  args: {
    isOpen: true,
    title: 'Small Dialog',
    size: 'small',
    children: (
      <p style={{ margin: 0 }}>This is a small dialog with simple content.</p>
    ),
    footer: <DefaultFooter />,
    onClose: () => console.log('Dialog closed'),
  },
}

export const Medium: Story = {
  args: {
    isOpen: true,
    title: 'Medium Dialog',
    size: 'medium',
    children: (
      <div>
        <p>This is a medium dialog with more content.</p>
        <p>It can contain multiple paragraphs and other elements.</p>
      </div>
    ),
    footer: <DefaultFooter />,
    onClose: () => console.log('Dialog closed'),
  },
}

export const Large: Story = {
  args: {
    isOpen: true,
    title: 'Large Dialog',
    size: 'large',
    children: (
      <div>
        <p>This is a large dialog with lots of content.</p>
        <ul>
          <li>It can contain lists</li>
          <li>Forms</li>
          <li>Tables</li>
          <li>And other complex content</li>
        </ul>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
    ),
    footer: <DefaultFooter />,
    onClose: () => console.log('Dialog closed'),
  },
}

const FormContent = () => (
  <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <div>
      <label style={{ display: 'block', marginBottom: '8px' }}>Name</label>
      <input
        type="text"
        style={{
          width: '100%',
          padding: '8px',
          border: '1px solid #ddd',
          borderRadius: '4px',
        }}
      />
    </div>
    <div>
      <label style={{ display: 'block', marginBottom: '8px' }}>Email</label>
      <input
        type="email"
        style={{
          width: '100%',
          padding: '8px',
          border: '1px solid #ddd',
          borderRadius: '4px',
        }}
      />
    </div>
    <div>
      <label style={{ display: 'block', marginBottom: '8px' }}>Message</label>
      <textarea
        style={{
          width: '100%',
          padding: '8px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          minHeight: '100px',
          resize: 'vertical',
        }}
      />
    </div>
  </form>
)

export const WithForm: Story = {
  args: {
    isOpen: true,
    title: 'Contact Form',
    size: 'medium',
    children: <FormContent />,
    footer: <DefaultFooter />,
    onClose: () => console.log('Dialog closed'),
  },
}

const DeleteConfirmation = () => (
  <div style={{ textAlign: 'center', padding: '16px 0' }}>
    <div style={{ fontSize: '48px', color: '#dc3545', marginBottom: '16px' }}>
      ⚠️
    </div>
    <p style={{ fontSize: '18px', marginBottom: '8px' }}>
      Are you sure you want to delete this item?
    </p>
    <p style={{ color: '#666' }}>This action cannot be undone.</p>
  </div>
)

const DeleteFooter = () => (
  <>
    <button
      onClick={() => console.log('Cancel clicked')}
      style={{
        padding: '8px 16px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        backgroundColor: 'white',
        cursor: 'pointer',
      }}
    >
      Cancel
    </button>
    <button
      onClick={() => console.log('Delete clicked')}
      style={{
        padding: '8px 16px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#dc3545',
        color: 'white',
        cursor: 'pointer',
      }}
    >
      Delete
    </button>
  </>
)

export const DeleteConfirmationDialog: Story = {
  args: {
    isOpen: true,
    title: 'Delete Item',
    size: 'small',
    children: <DeleteConfirmation />,
    footer: <DeleteFooter />,
    onClose: () => console.log('Dialog closed'),
  },
}
