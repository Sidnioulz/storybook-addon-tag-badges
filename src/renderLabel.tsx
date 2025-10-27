import React from 'react'
import { API_HashEntry, type StatusByTypeId } from 'storybook/internal/types'
import { experimental_useStatusStore } from 'storybook/manager-api'

import { Sidebar } from './components/Sidebar'
import { itemIsRoot } from './itemTypes'

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

export function renderLabel(item: API_HashEntry) {
  if (itemIsRoot(item)) {
    return
  }

  const itemStatuses = experimental_useStatusStore((all) => all[item.id])

  return (
    <Sidebar item={item} hasStatusWithUI={hasStatusWithUI(itemStatuses)}>
      {item.name}
    </Sidebar>
  )
}
