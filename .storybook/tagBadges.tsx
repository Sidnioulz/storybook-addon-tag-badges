import { defaultConfig, type TagBadgeParameters } from '../src/index'

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
      sidebar: ['component', 'group'],
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
