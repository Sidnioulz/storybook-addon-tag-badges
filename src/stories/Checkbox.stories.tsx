import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Checkbox } from './Checkbox'

const meta = {
  title: 'Forms/Checkbox',
  component: Checkbox,
  tags: ['autodocs', 'qa:pass', 'version:1.0.2'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Default checkbox',
  },
}

export const Checked: Story = {
  args: {
    label: 'Checked checkbox',
    defaultChecked: true,
  },
}

export const WithoutLabel: Story = {
  args: {
    defaultChecked: true,
  },
}

export const Disabled: Story = {
  args: {
    label: 'Disabled checkbox',
    disabled: true,
  },
}

export const DisabledChecked: Story = {
  args: {
    label: 'Disabled checked checkbox',
    disabled: true,
    defaultChecked: true,
  },
}

export const Indeterminate: Story = {
  args: {
    label: 'Indeterminate checkbox',
    indeterminate: true,
  },
}

export const Small: Story = {
  args: {
    label: 'Small checkbox',
    size: 'small',
  },
}

export const Medium: Story = {
  args: {
    label: 'Medium checkbox',
    size: 'medium',
  },
}

export const Large: Story = {
  args: {
    label: 'Large checkbox',
    size: 'large',
  },
}

export const WithError: Story = {
  args: {
    label: 'Checkbox with error',
    error: true,
    helper: 'This field is required',
  },
}

export const WithHelper: Story = {
  args: {
    label: 'Checkbox with helper text',
    helper: 'Additional information about the checkbox',
  },
}

export const WithLongLabel: Story = {
  args: {
    label:
      'This is a very long label that demonstrates how the checkbox component handles text wrapping for longer content that might span multiple lines',
  },
}

export const Controlled: Story = {
  args: {
    label: 'Controlled checkbox',
    checked: true,
    onChange: (checked) => console.log('Checkbox changed:', checked),
  },
}

export const Group: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Checkbox label="Option 1" defaultChecked />
      <Checkbox label="Option 2" />
      <Checkbox label="Option 3" />
      <Checkbox label="Disabled option" disabled />
    </div>
  ),
}

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '24px' }}>
        <Checkbox label="Unchecked" />
        <Checkbox label="Checked" defaultChecked />
        <Checkbox label="Indeterminate" indeterminate />
      </div>
      <div style={{ display: 'flex', gap: '24px' }}>
        <Checkbox label="Disabled" disabled />
        <Checkbox label="Disabled checked" disabled defaultChecked />
        <Checkbox label="Disabled indeterminate" disabled indeterminate />
      </div>
      <div style={{ display: 'flex', gap: '24px' }}>
        <Checkbox label="With error" error helper="Error message" />
        <Checkbox label="With helper" helper="Helper message" />
      </div>
    </div>
  ),
}
