import type { Meta, StoryObj } from '@storybook/react'
import { Toggle } from './Toggle'

const meta = {
  title: 'Actions/Toggle',
  component: Toggle,
  tags: ['autodocs', 'qa:pass', 'version:1.3.0'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Toggle me',
  },
}

export const Checked: Story = {
  args: {
    defaultChecked: true,
    label: 'Toggle me',
  },
}

export const Small: Story = {
  args: {
    size: 'small',
    label: 'Small toggle',
  },
}

export const Medium: Story = {
  args: {
    size: 'medium',
    label: 'Medium toggle',
  },
}

export const Large: Story = {
  args: {
    size: 'large',
    label: 'Large toggle',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Disabled toggle',
  },
}

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
    label: 'Disabled checked toggle',
  },
}

export const WithoutLabel: Story = {
  args: {},
}
