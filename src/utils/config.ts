import { addons } from 'storybook/manager-api'

import { KEY } from '../constants'
import { defaultConfig } from '../defaultConfig'
import type { TagBadgeParameters } from '../types/TagBadgeParameters'

/**
 * Reads the addon's badge config from the manager config, falling back to the
 * default config when none is set.
 */
export function readConfig(config = addons.getConfig()): TagBadgeParameters {
  return config?.[KEY] ?? defaultConfig
}
