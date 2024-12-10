import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Form } from './Form'

interface FormData {
  [key: string]: string
}

const meta = {
  title: 'Forms/Form',
  component: Form,
  tags: [
    'autodocs',
    'qa:pass',
    'supports:remix',
    'supports:redux',
    'version:1.0.0',
  ],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Form>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onSubmit: (data: FormData) => console.log('Form submitted:', data),
    children: (
      <>
        <input type="text" name="name" placeholder="Enter your name" required />
        <button type="submit">Submit</button>
      </>
    ),
  },
}

export const WithValidation: Story = {
  args: {
    onSubmit: (data: FormData) => console.log('Form submitted:', data),
    validate: (data: FormData) => {
      const errors: Record<string, string> = {}
      if (!data.email?.includes('@')) {
        errors.email = 'Invalid email address'
      }
      if ((data.password?.length || 0) < 8) {
        errors.password = 'Password must be at least 8 characters'
      }
      return errors
    },
    children: (
      <>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          required
        />
        <button type="submit">Subscribe</button>
      </>
    ),
  },
}
