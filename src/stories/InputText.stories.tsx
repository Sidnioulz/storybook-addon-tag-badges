import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { InputText } from './InputText'

const meta = {
  title: 'Forms/InputText',
  component: InputText,
  tags: ['autodocs', 'qa:pass', 'version:1.0.0'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof InputText>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
}

export const WithLabel: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter username',
  },
}

export const WithHelper: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter password',
    helper: 'Must be at least 8 characters',
  },
}

export const WithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter email',
    value: 'invalid-email',
    error: 'Please enter a valid email address',
  },
}

export const WithLeftIcon: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search...',
    leftIcon: <span>🔍</span>,
  },
}

export const WithRightIcon: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter password',
    rightIcon: <span>👁️</span>,
  },
}

export const Small: Story = {
  args: {
    size: 'small',
    placeholder: 'Small input',
  },
}

export const Medium: Story = {
  args: {
    size: 'medium',
    placeholder: 'Medium input',
  },
}

export const Large: Story = {
  args: {
    size: 'large',
    placeholder: 'Large input',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    placeholder: 'Cannot type here',
    disabled: true,
  },
}

export const WithBothIcons: Story = {
  args: {
    label: 'Search Users',
    placeholder: 'Search...',
    leftIcon: <span>🔍</span>,
    rightIcon: <span>⌫</span>,
  },
}

export const ReadOnly: Story = {
  args: {
    label: 'API Key',
    value: 'sk-1234567890abcdef',
    readOnly: true,
  },
}
