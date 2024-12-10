import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Tabs, TabItem } from './Tabs'

const meta = {
  title: 'Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs', 'qa:pass', 'version:1.0.0'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

const TabContent = ({ text }: { text: string }) => (
  <div
    style={{ padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}
  >
    {text}
  </div>
)

const DefaultTabs = () => (
  <Tabs>
    <TabItem id="tab1" label="Tab 1">
      <TabContent text="Content for Tab 1" />
    </TabItem>
    <TabItem id="tab2" label="Tab 2">
      <TabContent text="Content for Tab 2" />
    </TabItem>
    <TabItem id="tab3" label="Tab 3">
      <TabContent text="Content for Tab 3" />
    </TabItem>
  </Tabs>
)

export const Default: Story = {
  args: {
    children: <DefaultTabs />,
  },
}

export const Underline: Story = {
  args: {
    children: (
      <>
        <TabItem id="tab1" label="Tab 1">
          <TabContent text="Content for Tab 1" />
        </TabItem>
        <TabItem id="tab2" label="Tab 2">
          <TabContent text="Content for Tab 2" />
        </TabItem>
        <TabItem id="tab3" label="Tab 3">
          <TabContent text="Content for Tab 3" />
        </TabItem>
      </>
    ),
    variant: 'underline',
  },
}

export const Pills: Story = {
  args: {
    variant: 'pills',
  },
  render: () => (
    <Tabs variant="pills">
      <TabItem id="tab1" label="Tab 1">
        <TabContent text="Content for Tab 1" />
      </TabItem>
      <TabItem id="tab2" label="Tab 2">
        <TabContent text="Content for Tab 2" />
      </TabItem>
      <TabItem id="tab3" label="Tab 3">
        <TabContent text="Content for Tab 3" />
      </TabItem>
    </Tabs>
  ),
}

export const WithDisabledTab: Story = {
  args: {},
  render: () => (
    <Tabs>
      <TabItem id="tab1" label="Tab 1">
        <TabContent text="Content for Tab 1" />
      </TabItem>
      <TabItem id="tab2" label="Tab 2" disabled>
        <TabContent text="Content for Tab 2" />
      </TabItem>
      <TabItem id="tab3" label="Tab 3">
        <TabContent text="Content for Tab 3" />
      </TabItem>
    </Tabs>
  ),
}

export const WithDefaultTab: Story = {
  args: {
    defaultTab: 'tab2',
  },
  render: () => (
    <Tabs defaultTab="tab2">
      <TabItem id="tab1" label="Tab 1">
        <TabContent text="Content for Tab 1" />
      </TabItem>
      <TabItem id="tab2" label="Tab 2">
        <TabContent text="Content for Tab 2" />
      </TabItem>
      <TabItem id="tab3" label="Tab 3">
        <TabContent text="Content for Tab 3" />
      </TabItem>
    </Tabs>
  ),
}

export const WithLongContent: Story = {
  args: {},
  render: () => (
    <Tabs>
      <TabItem id="tab1" label="Long Tab">
        <TabContent text="This is a very long content that demonstrates how the tabs handle larger amounts of content. It might contain paragraphs, lists, or other complex content structures." />
      </TabItem>
      <TabItem id="tab2" label="Short Tab">
        <TabContent text="Short content" />
      </TabItem>
      <TabItem id="tab3" label="Medium Tab">
        <TabContent text="This is medium length content that fits somewhere in between." />
      </TabItem>
    </Tabs>
  ),
}
