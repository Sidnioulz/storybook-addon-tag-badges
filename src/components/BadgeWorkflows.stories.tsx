import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Title, Stories } from '@storybook/blocks'

import { Badge, getBadgeProps } from './Badge'
import {
  brandComponents,
  byMarket,
  compliance,
  composition,
  dependencies,
  smartComponents,
} from '../examples/sampleWorkflows'
import { mockEntry } from '../examples/__fixtures__/HashEntry'
import { TagBadgeParameters } from 'src/types/TagBadgeParameters'
import { styled } from '@storybook/theming'
import toSource from 'tosource'

const disabledArgType = {
  control: {
    disable: true,
  },
  table: {
    disable: true,
  },
}

interface SampleBadgeProps {
  sample: TagBadgeParameters
  tags: { tag: string; index?: number }[]
}

const List = styled.ul`
  list-style-type: none;
  display: flex;
  gap: 4px;
`

const SampleBadgeList = ({ sample, tags }: SampleBadgeProps) => (
  <List>
    {tags.map(({ tag, index = 0 }) => (
      <li key={tag}>
        <Badge
          {...getBadgeProps(sample[index].badge, mockEntry, tag)}
          context="toolbar"
        />
      </li>
    ))}
  </List>
)

const meta: Meta<typeof Badge> = {
  title: 'Addon/Sample Workflows',
  parameters: {
    docs: {
      description: {
        component:
          'This page showcases various workflows that can be implemented with this addon.',
      },
      page: () => (
        <>
          <Title />
          <Stories />
        </>
      ),
    },
    layout: 'centered',
  },

  tags: ['autodocs'],
  argTypes: {
    text: disabledArgType,
    bgColor: disabledArgType,
    borderColor: disabledArgType,
    fgColor: disabledArgType,
    tooltip: disabledArgType,
  },
}

export default meta
type Story = StoryObj<typeof Badge>

export const MarketSegmentation: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'You could highlight components intended for a specific type of product or market, e.g. because of different privacy or accessibility regulatory practices (government), or to account for preferred layout density (B2B vs B2C).',
      },
      source: {
        code: toSource(byMarket),
        language: 'js',
      },
    },
  },
  render: () => (
    <SampleBadgeList
      sample={byMarket}
      tags={[
        { tag: 'market:b2b' },
        { tag: 'market:b2c' },
        { tag: 'market:finance' },
        { tag: 'market:health' },
        { tag: 'market:government' },
        { tag: 'market:all' },
      ]}
    />
  ),
}

export const BrandExpressiveness: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'In some Design Systems, some components are made purely for brand expression, to help create highly-recognisable interfaces for e.g. acquisition or onboarding. Tagging those components (or variants) can help designers balance the amount of brand expression in a page more purposefully.',
      },
      source: {
        code: toSource(brandComponents),
        language: 'js',
      },
    },
  },
  render: () => (
    <SampleBadgeList
      sample={brandComponents}
      tags={[{ tag: 'brand' }, { tag: 'ui', index: 1 }]}
    />
  ),
}

export const Compliance: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'You may track the status of various checks using badges, ideally with a script that keeps this content up-to-date automatically. Checks from external teams can include accessibility compliance (WCAG), brand or content reviews, QA or SEO reviews.',
      },
      source: {
        code: toSource(composition),
        language: 'js',
      },
    },
  },
  render: () => (
    <SampleBadgeList
      sample={compliance}
      tags={[
        { tag: 'a11y:fail', index: 0 },
        { tag: 'brand:fail', index: 0 },
        { tag: 'content:fail', index: 0 },
        { tag: 'qa:fail', index: 0 },
        { tag: 'seo:fail', index: 0 },
        { tag: 'a11y:success', index: 1 },
        { tag: 'brand:success', index: 1 },
        { tag: 'content:success', index: 1 },
        { tag: 'qa:success', index: 1 },
        { tag: 'seo:success', index: 1 },
      ]}
    />
  ),
}

export const Composition: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "You may use badges to indicate components intended to be used together as a form of [component composition](https://lit.dev/docs/composition/component-composition/). Some types of components, like cards, dialogs or forms elements, are particularly suited to this pattern. Some basic components like Labels or Buttons can be composed with several other groups of components, so you could apply multiple badges to those.\n\nStorybook 8.4 allows you to filter the sidebar by tags, allowing your users to get a bird's-eye view of all the content available to compose cards, dialogs, etc.",
      },
      source: {
        code: toSource(composition),
        language: 'js',
      },
    },
  },
  render: () => (
    <SampleBadgeList
      sample={composition}
      tags={[
        { tag: 'compose:card' },
        { tag: 'compose:dialog' },
        { tag: 'compose:form' },
        { tag: 'compose:all' },
      ]}
    />
  ),
}

export const ExternalDependencies: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "You may highlight the external services a component depends on to function properly, to help your users avoid common issues. This could include external data stores like a cache, database or localStorage, or features that involve a context provider or app store to be initialised, like i18n, theming or access to the end user's profile and permissions.",
      },
      source: {
        code: toSource(composition),
        language: 'js',
      },
    },
  },
  render: () => (
    <SampleBadgeList
      sample={dependencies}
      tags={[
        { tag: 'uses:cache' },
        { tag: 'uses:i18n' },
        { tag: 'uses:theme' },
        { tag: 'uses:localStorage' },
        { tag: 'uses:database' },
        { tag: 'uses:auth' },
        { tag: 'uses:store' },
      ]}
    />
  ),
}

export const SmartComponents: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'If your team provides specialised versions of components optimised for use with a third-party service, aka. [smart components](https://bradfrost.com/blog/post/the-design-system-ecosystem/), you may highlight the different available flavours with a badge.\n\nFor instance, a Form component could be published to integrate with Zod schemas, and another to integrate with a Redux store. Another one could be a pure HTML form for contexts without frontend frameworks.',
      },
      source: {
        code: toSource(smartComponents),
        language: 'js',
      },
    },
  },
  render: () => (
    <SampleBadgeList
      sample={smartComponents}
      tags={[
        { tag: 'smart:redux' },
        { tag: 'smart:html' },
        { tag: 'smart:zod' },
      ]}
    />
  ),
}
