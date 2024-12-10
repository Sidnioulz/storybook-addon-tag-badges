import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Fieldset } from './Fieldset'

const meta = {
  title: 'Forms/Fieldset',
  component: Fieldset,
  tags: ['autodocs', 'deprecated', 'qa:pass', 'version:1.0.0'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Fieldset>

export default meta
type Story = StoryObj<typeof Fieldset>

const ExampleFormContent = () => (
  <>
    <div>
      <label style={{ display: 'block', marginBottom: '4px' }}>
        First Name
      </label>
      <input type="text" style={{ padding: '8px', width: '200px' }} />
    </div>
    <div>
      <label style={{ display: 'block', marginBottom: '4px' }}>Last Name</label>
      <input type="text" style={{ padding: '8px', width: '200px' }} />
    </div>
  </>
)

export const Default: Story = {
  render: () => (
    <Fieldset legend="Personal Information">
      <ExampleFormContent />
    </Fieldset>
  ),
}

export const Required: Story = {
  render: () => (
    <Fieldset legend="Personal Information" required>
      <ExampleFormContent />
    </Fieldset>
  ),
}

export const WithHelper: Story = {
  render: () => (
    <Fieldset
      legend="Personal Information"
      helper="Please enter your full legal name as it appears on your ID"
    >
      <ExampleFormContent />
    </Fieldset>
  ),
}

export const WithError: Story = {
  render: () => (
    <Fieldset
      legend="Personal Information"
      error="Please fill in all required fields"
    >
      <ExampleFormContent />
    </Fieldset>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Fieldset legend="Personal Information" disabled>
      <ExampleFormContent />
    </Fieldset>
  ),
}

export const WithoutLegend: Story = {
  render: () => (
    <Fieldset>
      <ExampleFormContent />
    </Fieldset>
  ),
}

export const NestedFieldsets: Story = {
  render: () => (
    <Fieldset legend="User Details">
      <Fieldset legend="Personal Information">
        <ExampleFormContent />
      </Fieldset>
      <Fieldset legend="Contact Information">
        <div>
          <label style={{ display: 'block', marginBottom: '4px' }}>Email</label>
          <input type="email" style={{ padding: '8px', width: '200px' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '4px' }}>Phone</label>
          <input type="tel" style={{ padding: '8px', width: '200px' }} />
        </div>
      </Fieldset>
    </Fieldset>
  ),
}

export const WithComplexContent: Story = {
  render: () => (
    <Fieldset legend="Preferences">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input type="checkbox" />
          Receive email notifications
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input type="checkbox" />
          Subscribe to newsletter
        </label>
        <div style={{ marginTop: '8px' }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>
            Communication frequency
          </label>
          <select style={{ padding: '8px', width: '200px' }}>
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
          </select>
        </div>
      </div>
    </Fieldset>
  ),
}

export const RequiredWithError: Story = {
  render: () => (
    <Fieldset
      legend="Personal Information"
      required
      error="All fields are required"
    >
      <ExampleFormContent />
    </Fieldset>
  ),
}
