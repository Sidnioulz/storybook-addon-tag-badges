import type { ProjectAnnotations, Renderer } from 'storybook/internal/types'
import { addons } from 'storybook/internal/preview-api'
import { EVENTS } from './constants'
import { TagBadgeParameters } from './types/TagBadgeParameters'

declare global {
  interface Window {
    tagBadges: TagBadgeParameters
  }
}

const preview: ProjectAnnotations<Renderer> = {}

const channel = addons.getChannel()

// Initialize with empty array to avoid undefined errors
window.tagBadges = []

// Request config from manager (which will set window.tagBadges)
channel.emit(EVENTS.REQUEST_CONFIG)
channel.on(EVENTS.CONFIG_READY, () => {
  // Config is now available in window.tagBadges (set by manager)
  // This is kept for backward compatibility with non-MDX components
})

export default preview
