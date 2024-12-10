import React from 'react'

interface LinkProps {
  href: string
  children: React.ReactNode
  variant?: 'default' | 'underline' | 'button'
  external?: boolean
  disabled?: boolean
}

export const Link = ({
  href,
  children,
  variant = 'default',
  external = false,
  disabled = false,
}: LinkProps) => {
  const baseStyles: React.CSSProperties = {
    color: disabled ? '#999' : '#2196F3',
    textDecoration: variant === 'underline' ? 'underline' : 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    pointerEvents: disabled ? 'none' : 'auto',
  }

  const buttonStyles: React.CSSProperties =
    variant === 'button'
      ? {
          display: 'inline-block',
          padding: '8px 16px',
          backgroundColor: disabled ? '#e0e0e0' : '#2196F3',
          color: 'white',
          borderRadius: '4px',
          border: 'none',
        }
      : {}

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault()
    }
  }

  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      style={{ ...baseStyles, ...buttonStyles }}
      onClick={handleClick}
    >
      {children}
      {external && (
        <span style={{ marginLeft: '4px', fontSize: '0.8em' }}>↗</span>
      )}
    </a>
  )
}
