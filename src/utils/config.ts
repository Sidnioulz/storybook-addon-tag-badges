import { addons } from 'storybook/manager-api'

import { KEY, OPTIONS_KEY } from '../constants'
import { defaultConfig } from '../defaultConfig'
import type { TagBadgeParameters } from '../types/TagBadgeParameters'
import type { TagBadgesOptions } from '../types/TagBadgesOptions'

/**
 * Reads the addon's badge config from the manager config, falling back to the
 * default config when none is set.
 */
export function readConfig(config = addons.getConfig()): TagBadgeParameters {
  return config?.[KEY] ?? defaultConfig
}

/**
 * Reads the addon's global options from the manager config.
 */
export function readOptions(config = addons.getConfig()): TagBadgesOptions {
  return config?.[OPTIONS_KEY] ?? {}
}
