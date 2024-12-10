import type { Meta, StoryObj } from '@storybook/react'
import { Datepicker } from './Datepicker'

const meta = {
  title: 'Actions/Datepicker',
  component: Datepicker,
  tags: ['autodocs', 'qa:pass', 'version:1.0.0'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Datepicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const WithSelectedDate: Story = {
  args: {
    value: new Date(2024, 0, 15), // January 15, 2024
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    value: new Date(2024, 0, 15),
  },
}

export const WithMinDate: Story = {
  args: {
    value: new Date(2024, 0, 15),
    minDate: new Date(2024, 0, 10), // Can't select dates before January 10, 2024
  },
}

export const WithMaxDate: Story = {
  args: {
    value: new Date(2024, 0, 15),
    maxDate: new Date(2024, 0, 20), // Can't select dates after January 20, 2024
  },
}

export const WithDateRange: Story = {
  args: {
    value: new Date(2024, 0, 15),
    minDate: new Date(2024, 0, 10),
    maxDate: new Date(2024, 0, 20),
  },
}

export const WithCustomOnChange: Story = {
  args: {
    onChange: (date: Date) => {
      console.log('Selected date:', date.toLocaleDateString())
    },
  },
}

export const WithTodayAsDefault: Story = {
  args: {
    value: new Date(),
  },
}

export const WithPastDate: Story = {
  args: {
    value: new Date(2023, 11, 25), // December 25, 2023
  },
}

export const WithFutureDate: Story = {
  args: {
    value: new Date(2024, 11, 31), // December 31, 2024
  },
}
