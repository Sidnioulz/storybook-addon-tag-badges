import React from 'react'

interface BackdropProps {
  open: boolean
  onClick?: () => void
  children?: React.ReactNode
  className?: string
}

export const Backdrop = ({
  open,
  onClick,
  children,
  className,
}: BackdropProps) => {
  if (!open) return null

  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      {children}
    </div>
  )
}
