import type { Meta, StoryObj } from '@storybook/react'
import { InputDate } from './InputDate'

const meta = {
  title: 'Forms/InputDate',
  component: InputDate,
  tags: ['autodocs', 'experimental', 'qa:todo'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof InputDate>

export default meta
type Story = StoryObj<typeof InputDate>

export const Default: Story = {
  args: {
    value: '2023-12-25',
    onChange: (value: string) => console.log('Date changed:', value),
  },
}

export const WithLabel: Story = {
  args: {
    label: 'Select Date',
    value: '2023-12-25',
    onChange: (value: string) => console.log('Date changed:', value),
  },
}

export const Required: Story = {
  args: {
    label: 'Birth Date',
    required: true,
    value: '2023-12-25',
    onChange: (value: string) => console.log('Date changed:', value),
  },
}

export const Disabled: Story = {
  args: {
    label: 'Holiday',
    disabled: true,
    value: '2023-12-25',
    onChange: (value: string) => console.log('Date changed:', value),
  },
}

export const WithMinMax: Story = {
  args: {
    label: 'Select Date',
    min: '2023-01-01',
    max: '2023-12-31',
    value: '2023-06-15',
    onChange: (value: string) => console.log('Date changed:', value),
  },
}
