import { defaultConfig, type TagBadgeParameters } from '../src/manager-helpers'

export default [
  ...defaultConfig,
  {
    tags: 'frog',
    badge: {
      text: 'Frog 🐸',
      style: {
        backgroundColor: '#001c13',
        color: '#e0eb0b',
      },
      tooltip: 'This component can catch flies!',
    },
    display: {
      sidebar: [
        { skipInherited: true, type: 'component' },
        { skipInherited: true, type: 'group' },
      ],
      toolbar: true,
    },
  },
  {
    tags: 'big-if-true',
    badge: {
      text: 'Big Frog!',
      style: {
        backgroundColor: '#33001c',
        color: '#0be0b5',
      },
      tooltip: 'This is one big frog!',
    },
    display: {
      sidebar: true,
      toolbar: true,
    },
  },
  {
    tags: 'very-tight-space',
    badge: {
      text: 'Multi-word Badge, badgeofmanyletters',
      style: {
        backgroundColor: '#1c0033',
        color: '#e00b53',
      },
    },
    display: {
      sidebar: true,
      toolbar: false,
    },
  },
] satisfies TagBadgeParameters
