import React, { FC } from 'react'
import { useStorybookApi } from '@storybook/manager-api'
import type {
  API_ComponentEntry,
  API_DocsEntry,
  API_GroupEntry,
  API_StoryEntry,
} from '@storybook/types'
import { KEY } from '../constants'
import { Parameters } from 'src/schemas/parameters'
// import { defaultBadgesConfig } from "../../config";
// import { BadgesConfig } from "../../typings.interface";
// import { Badges } from "../../components";

interface SidebarProps {
  item: API_DocsEntry | API_GroupEntry | API_StoryEntry | API_ComponentEntry
}

function printTitleOrName(
  item: API_DocsEntry | API_GroupEntry | API_StoryEntry | API_ComponentEntry,
) {
  return 'title' in item ? item.title : item.name
}

export const Sidebar: FC<SidebarProps> = ({ item }) => {
  const api = useStorybookApi()
  const parameters = api.getCurrentParameter<Parameters>(KEY)

  if (!parameters) {
    return printTitleOrName(item)
  }

  // const storyBadges: Array<string> = parameters[PARAM_BADGES_KEY]
  // const customBadgesConfig: BadgesConfig = parameters[PARAM_CONFIG_KEY]

  // const config = {
  //   ...defaultBadgesConfig,
  //   ...customBadgesConfig,
  // }

  // const badges = storyBadges
  //   .map((badge) => config[badge])
  //   .filter((badge) => badge.location?.includes('sidebar'))

  return (
    <>
      {printTitleOrName(item)}
      BADGER
      {/* <Badges badges={badges} /> */}
    </>
  )
}
