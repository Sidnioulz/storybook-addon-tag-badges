import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Breadcrumbs, BreadcrumbItem } from './Breadcrumbs'

const meta = {
  title: 'Navigation/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs', 'qa:pass', 'version:1.0.0'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Breadcrumbs>

export default meta
type Story = StoryObj<typeof Breadcrumbs>

export const Default: Story = {
  render: () => (
    <Breadcrumbs>
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem href="/products">Products</BreadcrumbItem>
      <BreadcrumbItem current>Electronics</BreadcrumbItem>
    </Breadcrumbs>
  ),
}

export const CustomSeparator: Story = {
  render: () => (
    <Breadcrumbs separator="›">
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem href="/products">Products</BreadcrumbItem>
      <BreadcrumbItem current>Electronics</BreadcrumbItem>
    </Breadcrumbs>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <Breadcrumbs>
      <BreadcrumbItem href="/">
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          🏠 Home
        </span>
      </BreadcrumbItem>
      <BreadcrumbItem href="/products">
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          📦 Products
        </span>
      </BreadcrumbItem>
      <BreadcrumbItem current>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          💻 Electronics
        </span>
      </BreadcrumbItem>
    </Breadcrumbs>
  ),
}

export const LongPath: Story = {
  render: () => (
    <Breadcrumbs>
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem href="/products">Products</BreadcrumbItem>
      <BreadcrumbItem href="/products/electronics">Electronics</BreadcrumbItem>
      <BreadcrumbItem href="/products/electronics/computers">
        Computers
      </BreadcrumbItem>
      <BreadcrumbItem href="/products/electronics/computers/laptops">
        Laptops
      </BreadcrumbItem>
      <BreadcrumbItem current>MacBook Pro</BreadcrumbItem>
    </Breadcrumbs>
  ),
}

export const Collapsed: Story = {
  render: () => (
    <Breadcrumbs maxItems={3}>
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem href="/products">Products</BreadcrumbItem>
      <BreadcrumbItem href="/products/electronics">Electronics</BreadcrumbItem>
      <BreadcrumbItem href="/products/electronics/computers">
        Computers
      </BreadcrumbItem>
      <BreadcrumbItem href="/products/electronics/computers/laptops">
        Laptops
      </BreadcrumbItem>
      <BreadcrumbItem current>MacBook Pro</BreadcrumbItem>
    </Breadcrumbs>
  ),
}

export const CustomCollapse: Story = {
  render: () => (
    <Breadcrumbs maxItems={4} itemsBeforeCollapse={2} itemsAfterCollapse={1}>
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem href="/products">Products</BreadcrumbItem>
      <BreadcrumbItem href="/products/electronics">Electronics</BreadcrumbItem>
      <BreadcrumbItem href="/products/electronics/computers">
        Computers
      </BreadcrumbItem>
      <BreadcrumbItem href="/products/electronics/computers/laptops">
        Laptops
      </BreadcrumbItem>
      <BreadcrumbItem current>MacBook Pro</BreadcrumbItem>
    </Breadcrumbs>
  ),
}

export const ArrowSeparator: Story = {
  render: () => (
    <Breadcrumbs separator="→">
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem href="/products">Products</BreadcrumbItem>
      <BreadcrumbItem current>Electronics</BreadcrumbItem>
    </Breadcrumbs>
  ),
}

export const SlashSeparator: Story = {
  render: () => (
    <Breadcrumbs separator="/">
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem href="/products">Products</BreadcrumbItem>
      <BreadcrumbItem current>Electronics</BreadcrumbItem>
    </Breadcrumbs>
  ),
}

export const SingleItem: Story = {
  render: () => (
    <Breadcrumbs>
      <BreadcrumbItem current>Home</BreadcrumbItem>
    </Breadcrumbs>
  ),
}
