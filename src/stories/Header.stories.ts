import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import { Header } from './Header'

const meta: Meta<typeof Header> = {
  title: 'Example/Header',
  component: Header,
  argTypes: {
    onLogin: fn(),
    onLogout: fn(),
    onCreateAccount: fn(),
  },
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['new'],
}

export default meta
type Story = StoryObj<typeof Header>

export const LoggedIn: Story = {
  args: {
    user: {
      name: 'Jane Doe',
    },
  },
}

export const LoggedOut: Story = {}
