import type { Meta, StoryObj } from '@storybook/react'
import { Pagination } from './Pagination'

const meta = {
  title: 'Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs', 'qa:pass', 'version:3.0.2'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof Pagination>

export const Default: Story = {
  args: {
    currentPage: 1,
    totalPages: 5,
    onPageChange: (page: number) => console.log('Page changed to:', page),
  },
}

export const ManyPages: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
    onPageChange: (page: number) => console.log('Page changed to:', page),
  },
}

export const LastPage: Story = {
  args: {
    currentPage: 5,
    totalPages: 5,
    onPageChange: (page: number) => console.log('Page changed to:', page),
  },
}
