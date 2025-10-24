import { readFile } from 'node:fs/promises'

import { defineConfig, type Options } from 'tsup'
import { globalPackages as globalManagerPackages } from 'storybook/internal/manager/globals'
import { globalPackages as globalPreviewPackages } from 'storybook/internal/preview/globals'

const BROWSER_TARGETS: Options['target'] = [
  'chrome131',
  'edge134',
  'firefox136',
  'safari18.3',
  'ios18.3',
  'opera117',
]
const NODE_TARGET: Options['target'] = ['node20']

type BundlerConfig = {
  bundler?: {
    exportEntries?: string[]
    nodeEntries?: string[]
    managerEntries?: string[]
    previewEntries?: string[]
  }
}

export default defineConfig(async (options) => {
  const packageJson = (await readFile('./package.json', 'utf8').then(
    JSON.parse,
  )) as BundlerConfig
  const {
    bundler: {
      exportEntries = [],
      managerEntries = [],
      previewEntries = [],
      nodeEntries = [],
    } = {},
  } = packageJson

  const commonConfig: Options = {
    splitting: false,
    minify: !options.watch,
    treeshake: true,
    sourcemap: true,
    clean: false,
  }

  const configs: Options[] = []

  // export entries are entries meant to be manually imported by the user
  // they are not meant to be loaded by the manager or preview
  // they'll be usable in both node and browser environments, depending on which features and modules they depend on
  if (exportEntries.length) {
    configs.push({
      ...commonConfig,
      entry: exportEntries,
      dts: {
        resolve: true,
      },
      format: ['esm', 'cjs'],
      platform: 'neutral',
      target: NODE_TARGET,
      external: [...globalManagerPackages, ...globalPreviewPackages],
    })
  }

  // manager entries are entries meant to be loaded into the manager UI
  // they'll have manager-specific packages externalized and they won't be usable in node
  // they won't have types generated for them as they're usually loaded automatically by Storybook
  if (managerEntries.length) {
    configs.push({
      ...commonConfig,
      entry: managerEntries,
      format: ['esm'],
      platform: 'browser',
      target: BROWSER_TARGETS,
      external: globalManagerPackages,
    })
  }

  // preview entries are entries meant to be loaded into the preview iframe
  // they'll have preview-specific packages externalized and they won't be usable in node
  // they'll have types generated for them so they can be imported when setting up Portable Stories
  if (previewEntries.length) {
    configs.push({
      ...commonConfig,
      entry: previewEntries,
      dts: {
        resolve: true,
      },
      format: ['esm', 'cjs'],
      platform: 'browser',
      target: BROWSER_TARGETS,
      external: globalPreviewPackages,
      // FIXME/TODO: react, react-dom, and react/jsx-runtime?
    })
  }

  // node entries are entries meant to be used in node-only
  // this is useful for presets, which are loaded by Storybook when setting up configurations
  // they won't have types generated for them as they're usually loaded automatically by Storybook
  if (nodeEntries.length) {
    configs.push({
      ...commonConfig,
      entry: nodeEntries,
      format: ['cjs'],
      platform: 'node',
      target: NODE_TARGET,
    })
  }

  return configs
})
