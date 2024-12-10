import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Icon, IconName } from './Icon'

const meta = {
  title: 'Data Display/Icon',
  component: Icon,
  tags: ['autodocs', 'new', 'qa:pass', 'version:1.0.0'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    name: 'home',
  },
}

const allIcons: IconName[] = [
  'home',
  'search',
  'user',
  'settings',
  'notification',
  'menu',
  'close',
  'check',
  'error',
  'info',
  'warning',
  'star',
  'heart',
  'arrow-left',
  'arrow-right',
]

export const AllIcons = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
      }}
    >
      {allIcons.map((name) => (
        <div
          key={name}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '8px',
            border: '1px solid #eee',
            borderRadius: '4px',
          }}
        >
          <Icon name={name} />
          <span style={{ marginTop: '4px', fontSize: '12px' }}>{name}</span>
        </div>
      ))}
    </div>
  ),
}

export const Sizes = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Icon name="star" size="small" />
      <Icon name="star" size="medium" />
      <Icon name="star" size="large" />
    </div>
  ),
}

export const Colors = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Icon name="heart" color="#ff0000" />
      <Icon name="heart" color="#00ff00" />
      <Icon name="heart" color="#0000ff" />
      <Icon name="heart" color="#ff00ff" />
    </div>
  ),
}

export const Small: Story = {
  args: {
    name: 'info',
    size: 'small',
  },
}

export const Medium: Story = {
  args: {
    name: 'info',
    size: 'medium',
  },
}

export const Large: Story = {
  args: {
    name: 'info',
    size: 'large',
  },
}

export const CustomColor: Story = {
  args: {
    name: 'warning',
    color: '#ff9900',
  },
}

export const WithBackground = {
  render: () => (
    <div
      style={{
        backgroundColor: '#f0f0f0',
        padding: '16px',
        borderRadius: '8px',
      }}
    >
      <Icon name="settings" />
    </div>
  ),
}

export const InText = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Icon name="info" size="small" />
      <span>Important information</span>
    </div>
  ),
}

export const ActionIcons = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px' }}>
      <Icon name="check" color="#4caf50" />
      <Icon name="close" color="#f44336" />
      <Icon name="warning" color="#ff9800" />
      <Icon name="info" color="#2196f3" />
    </div>
  ),
}
