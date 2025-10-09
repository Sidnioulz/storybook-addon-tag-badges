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
window.tagBadges = window.parent.tagBadges

channel.emit(EVENTS.REQUEST_CONFIG)
channel.on(EVENTS.CONFIG_READY, () => {
  window.tagBadges = window.parent.tagBadges
})

export default preview
