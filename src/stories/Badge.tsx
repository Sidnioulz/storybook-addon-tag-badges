import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error'
  size?: 'small' | 'medium' | 'large'
  rounded?: boolean
  outlined?: boolean
  className?: string
}

export const Badge = ({
  children,
  variant = 'default',
  size = 'medium',
  rounded = false,
  outlined = false,
  className,
}: BadgeProps) => {
  const getVariantColors = () => {
    const variants = {
      default: { bg: '#e0e0e0', color: '#333333' },
      primary: { bg: '#2196F3', color: 'white' },
      success: { bg: '#4CAF50', color: 'white' },
      warning: { bg: '#FFC107', color: '#333333' },
      error: { bg: '#f44336', color: 'white' },
    }

    const { bg, color } = variants[variant]
    return outlined
      ? { backgroundColor: 'transparent', color: bg, border: `1px solid ${bg}` }
      : { backgroundColor: bg, color, border: 'none' }
  }

  const sizes = {
    small: { padding: '2px 6px', fontSize: '12px' },
    medium: { padding: '4px 8px', fontSize: '14px' },
    large: { padding: '6px 12px', fontSize: '16px' },
  }

  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 500,
    borderRadius: rounded ? '999px' : '4px',
    ...sizes[size],
    ...getVariantColors(),
  }

  return (
    <span style={style} className={className}>
      {children}
    </span>
  )
}
