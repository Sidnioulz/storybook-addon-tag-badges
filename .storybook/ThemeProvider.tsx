import React, { Fragment } from 'react'
import {
  convert,
  createReset,
  Global,
  styled,
  ThemeProvider,
  themes,
} from '@storybook/theming'

const ThemeBlock = styled.div<{ side: 'left' | 'right'; layout: string }>(
  {
    position: 'absolute',
    top: 0,
    left: 0,
    right: '50vw',
    width: '50vw',
    height: '100vh',
    bottom: 0,
    overflow: 'auto',
  },
  ({ layout }) => ({
    padding: layout === 'fullscreen' ? 0 : '1rem',
    display: layout === 'centered' ? 'flex' : 'block',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  ({ theme }) => ({
    background: theme.background.content,
    color: theme.color.defaultText,
  }),
  ({ side }) =>
    side === 'left'
      ? {
          left: 0,
          right: '50vw',
        }
      : {
          right: 0,
          left: '50vw',
        },
)

const AddonThemeProvider = (StoryFn, { context: { viewMode }, parameters }) => {
  if (viewMode === 'docs') {
    return (
      <ThemeProvider theme={convert(themes.dark)}>
        <Global styles={createReset} />
        <StoryFn />
      </ThemeProvider>
    )
  }

  return (
    <Fragment>
      <ThemeProvider theme={convert(themes.light)}>
        <Global styles={createReset} />
      </ThemeProvider>
      <ThemeProvider theme={convert(themes.light)}>
        <ThemeBlock side="left" data-side="left" layout={parameters.layout}>
          <StoryFn />
        </ThemeBlock>
      </ThemeProvider>
      <ThemeProvider theme={convert(themes.dark)}>
        <ThemeBlock side="right" data-side="right" layout={parameters.layout}>
          <StoryFn />
        </ThemeBlock>
      </ThemeProvider>
    </Fragment>
  )
}

export default AddonThemeProvider
