import React from 'react'
import { API_HashEntry } from '@storybook/types'

import { Sidebar } from './components/Sidebar'

export function renderLabel(item: API_HashEntry) {
  if (
    item.type !== 'story' &&
    item.type !== 'docs' &&
    item.type !== 'component'
  ) {
    return
  }

  return <Sidebar item={item}>{item.name}</Sidebar>
}
