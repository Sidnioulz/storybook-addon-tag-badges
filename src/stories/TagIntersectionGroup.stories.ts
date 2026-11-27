import type { Meta, StoryObj } from '@storybook/react-vite'

const Bar = () => 'Toad'

// Every entry of the `All new` group has the `new` tag.
//
// With `legacyTagIntersection`, the group has the tags that all entries below
// it share, so both the group and the component show the `new` badge.
//
// Without it, badges follow the tags Storybook gives the group and the
// component. When groups have none, only the component shows the badge.
const meta: Meta<typeof Bar> = {
  title: 'NRT/Tag intersection/All new/Bar',
  component: Bar,
  tags: ['new'],
}

export default meta
type Story = StoryObj<typeof Bar>

export const One: Story = {}
export const Two: Story = {}
