import type { Meta, StoryObj } from '@storybook/react'
import { FileUpload } from './FileUpload'

const meta = {
  title: 'Forms/FileUpload',
  component: FileUpload,
  tags: ['autodocs', 'beta', 'qa:pass'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof FileUpload>

export default meta
type Story = StoryObj<typeof FileUpload>

export const Default: Story = {
  args: {
    onUpload: (files) => console.log('Uploaded files:', files),
  },
}

export const AcceptImages: Story = {
  args: {
    accept: 'image/*',
    label: 'Upload Images',
    onUpload: (files) => console.log('Uploaded images:', files),
  },
}

export const MultipleFiles: Story = {
  args: {
    multiple: true,
    label: 'Upload Multiple Files',
    onUpload: (files) => console.log('Uploaded multiple files:', files),
  },
}

export const WithMaxSize: Story = {
  args: {
    maxSize: 1024 * 1024, // 1MB
    label: 'Max file size: 1MB',
    onUpload: (files) => console.log('Uploaded files:', files),
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Upload Disabled',
    onUpload: (files) => console.log('Uploaded files:', files),
  },
}
