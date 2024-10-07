import type { ProjectAnnotations, Renderer } from '@storybook/types'

import { KEY } from './constants'
import { defaultConfig } from './defaultConfig'

const preview: ProjectAnnotations<Renderer> = {
  parameters: {
    [KEY]: defaultConfig,
  },
}

export default preview
