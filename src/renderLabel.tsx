import React from 'react'
import { API_HashEntry, type StatusByTypeId } from 'storybook/internal/types'
import { experimental_useStatusStore } from 'storybook/manager-api'

import { Sidebar } from './components/Sidebar'

function hasStatusWithUI(itemStatuses: StatusByTypeId): boolean {
  if (!itemStatuses) {
    return false
  }

  if (itemStatuses['storybook/component-test']) {
    return true
  }

  // Add future statuses with a UI element here.

  return false
}

function RenderLabelContent({ item }: { item: API_HashEntry }) {
  const itemStatuses = experimental_useStatusStore((all) => all[item.id])

  return (
    <Sidebar item={item} hasStatusWithUI={hasStatusWithUI(itemStatuses)}>
      {item.name}
    </Sidebar>
  )
}

export function renderLabel(item: API_HashEntry) {
  if (
    item.type !== 'story' &&
    item.type !== 'group' &&
    item.type !== 'docs' &&
    item.type !== 'component'
  ) {
    return
  }

  return <RenderLabelContent item={item} />
}
