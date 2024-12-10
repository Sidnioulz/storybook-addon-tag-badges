import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { ButtonGroup, ButtonGroupButton } from './ButtonGroup'

const meta = {
  title: 'Actions/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs', 'new', 'qa:todo', 'version:1.0.0'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ButtonGroup>

export default meta
type Story = StoryObj<typeof ButtonGroup>

export const Default: Story = {
  render: () => (
    <ButtonGroup>
      <ButtonGroupButton>Left</ButtonGroupButton>
      <ButtonGroupButton>Middle</ButtonGroupButton>
      <ButtonGroupButton>Right</ButtonGroupButton>
    </ButtonGroup>
  ),
}

export const Outlined: Story = {
  render: () => (
    <ButtonGroup variant="outlined">
      <ButtonGroupButton>Left</ButtonGroupButton>
      <ButtonGroupButton>Middle</ButtonGroupButton>
      <ButtonGroupButton>Right</ButtonGroupButton>
    </ButtonGroup>
  ),
}

export const Text: Story = {
  render: () => (
    <ButtonGroup variant="text">
      <ButtonGroupButton>Left</ButtonGroupButton>
      <ButtonGroupButton>Middle</ButtonGroupButton>
      <ButtonGroupButton>Right</ButtonGroupButton>
    </ButtonGroup>
  ),
}

export const Vertical: Story = {
  render: () => (
    <ButtonGroup orientation="vertical">
      <ButtonGroupButton>Top</ButtonGroupButton>
      <ButtonGroupButton>Middle</ButtonGroupButton>
      <ButtonGroupButton>Bottom</ButtonGroupButton>
    </ButtonGroup>
  ),
}

export const Small: Story = {
  render: () => (
    <ButtonGroup size="small">
      <ButtonGroupButton>Left</ButtonGroupButton>
      <ButtonGroupButton>Middle</ButtonGroupButton>
      <ButtonGroupButton>Right</ButtonGroupButton>
    </ButtonGroup>
  ),
}

export const Large: Story = {
  render: () => (
    <ButtonGroup size="large">
      <ButtonGroupButton>Left</ButtonGroupButton>
      <ButtonGroupButton>Middle</ButtonGroupButton>
      <ButtonGroupButton>Right</ButtonGroupButton>
    </ButtonGroup>
  ),
}

export const FullWidth: Story = {
  render: () => (
    <ButtonGroup fullWidth>
      <ButtonGroupButton>Left</ButtonGroupButton>
      <ButtonGroupButton>Middle</ButtonGroupButton>
      <ButtonGroupButton>Right</ButtonGroupButton>
    </ButtonGroup>
  ),
}

export const WithDisabledButtons: Story = {
  render: () => (
    <ButtonGroup>
      <ButtonGroupButton>Enabled</ButtonGroupButton>
      <ButtonGroupButton disabled>Disabled</ButtonGroupButton>
      <ButtonGroupButton>Enabled</ButtonGroupButton>
    </ButtonGroup>
  ),
}

export const AllDisabled: Story = {
  render: () => (
    <ButtonGroup disabled>
      <ButtonGroupButton>Left</ButtonGroupButton>
      <ButtonGroupButton>Middle</ButtonGroupButton>
      <ButtonGroupButton>Right</ButtonGroupButton>
    </ButtonGroup>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <ButtonGroup>
      <ButtonGroupButton>
        <span style={{ marginRight: '4px' }}>←</span>
        Previous
      </ButtonGroupButton>
      <ButtonGroupButton>
        Next
        <span style={{ marginLeft: '4px' }}>→</span>
      </ButtonGroupButton>
    </ButtonGroup>
  ),
}

export const VerticalFullWidth: Story = {
  render: () => (
    <ButtonGroup orientation="vertical" fullWidth>
      <ButtonGroupButton>Top</ButtonGroupButton>
      <ButtonGroupButton>Middle</ButtonGroupButton>
      <ButtonGroupButton>Bottom</ButtonGroupButton>
    </ButtonGroup>
  ),
}

export const WithActiveState: Story = {
  render: () => (
    <ButtonGroup>
      <ButtonGroupButton>Normal</ButtonGroupButton>
      <ButtonGroupButton active>Active</ButtonGroupButton>
      <ButtonGroupButton>Normal</ButtonGroupButton>
    </ButtonGroup>
  ),
}
