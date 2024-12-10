import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Drawer } from './Drawer'

const meta = {
  title: 'Overlay/Drawer',
  component: Drawer,
  tags: ['autodocs', 'outdated', 'qa:fail', 'version:1.1.0'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj<typeof meta>

const NavigationLink = ({ children }: { children: React.ReactNode }) => {
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <a
      href="#"
      style={{
        color: '#333',
        textDecoration: 'none',
        display: 'block',
        padding: '8px',
        borderRadius: '4px',
        backgroundColor: isHovered ? '#f5f5f5' : 'transparent',
        transition: 'background-color 0.2s',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </a>
  )
}

const NavigationContent = () => (
  <>
    <h3 style={{ margin: '0 0 16px 0' }}>Navigation</h3>
    <nav>
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <li>
          <NavigationLink>Home</NavigationLink>
        </li>
        <li>
          <NavigationLink>About</NavigationLink>
        </li>
        <li>
          <NavigationLink>Contact</NavigationLink>
        </li>
      </ul>
    </nav>
  </>
)

export const Left: Story = {
  args: {
    isOpen: true,
    position: 'left',
    children: <NavigationContent />,
    onClose: () => console.log('Drawer closed'),
  },
}

export const Right: Story = {
  args: {
    isOpen: true,
    position: 'right',
    children: <NavigationContent />,
    onClose: () => console.log('Drawer closed'),
  },
}

const FilterContent = () => (
  <>
    <h3 style={{ margin: '0 0 16px 0' }}>Filters</h3>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '8px' }}>
          Category
        </label>
        <select
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        >
          <option>All</option>
          <option>Electronics</option>
          <option>Books</option>
          <option>Clothing</option>
        </select>
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '8px' }}>
          Price Range
        </label>
        <input type="range" min="0" max="1000" style={{ width: '100%' }} />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '8px' }}>Rating</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              style={{
                background: 'none',
                border: 'none',
                padding: '4px',
                cursor: 'pointer',
                fontSize: '20px',
                color: '#ffd700',
              }}
            >
              ★
            </button>
          ))}
        </div>
      </div>
    </div>
  </>
)

export const WithFilters: Story = {
  args: {
    isOpen: true,
    position: 'right',
    children: <FilterContent />,
    onClose: () => console.log('Drawer closed'),
  },
}
