import type { Meta, StoryObj } from '@storybook/react-vite'

const Foo = () => 'Frog'

// The meta sets `new`, and one story removes it.
//
// With `legacyTagIntersection`, the component has the tags that all of its
// stories share, so it has no `new` badge, and every story but `FiveOld`
// shows one.
//
// Without it, badges follow the tags Storybook gives the component. When
// these are the tags of the meta, the component shows the `new` badge, and
// its stories don't repeat it.
const meta: Meta<typeof Foo> = {
  title: 'NRT/Tag intersection/Foo',
  component: Foo,
  tags: ['new'],
}

export default meta
type Story = StoryObj<typeof Foo>

export const One: Story = {}
export const Two: Story = {}
export const Three: Story = {}
export const Four: Story = {}
export const FiveOld: Story = {
  tags: ['!new'],
}
export const Six: Story = {}
