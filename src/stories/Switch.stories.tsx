import type { Meta, StoryObj } from '@storybook/react'
import { Switch } from './Switch'

const meta = {
  title: 'Actions/Switch',
  component: Switch,
  tags: ['autodocs', 'outdated', 'qa:fail', 'version:1.0.0'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Switch me',
  },
}

export const Checked: Story = {
  args: {
    defaultChecked: true,
    label: 'Switch me',
  },
}

export const Small: Story = {
  args: {
    size: 'small',
    label: 'Small switch',
  },
}

export const Medium: Story = {
  args: {
    size: 'medium',
    label: 'Medium switch',
  },
}

export const Large: Story = {
  args: {
    size: 'large',
    label: 'Large switch',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Disabled switch',
  },
}

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
    label: 'Disabled checked switch',
  },
}

export const WithoutLabel: Story = {
  args: {},
}
