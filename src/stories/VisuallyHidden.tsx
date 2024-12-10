import React from 'react'

interface VisuallyHiddenProps {
  children: React.ReactNode
}

export const VisuallyHidden = ({ children }: VisuallyHiddenProps) => {
  return (
    <span
      style={{
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: '1px',
        margin: '-1px',
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        width: '1px',
        whiteSpace: 'nowrap',
        wordWrap: 'normal',
      }}
    >
      {children}
    </span>
  )
}
