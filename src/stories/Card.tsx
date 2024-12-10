import React from 'react'

interface CardProps {
  title?: React.ReactNode
  subtitle?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  variant?: 'default' | 'outlined' | 'elevated'
  padding?: 'none' | 'small' | 'medium' | 'large'
  className?: string
}

export const Card = ({
  title,
  subtitle,
  children,
  footer,
  variant = 'default',
  padding = 'medium',
  className,
}: CardProps) => {
  const paddings = {
    none: '0',
    small: '12px',
    medium: '16px',
    large: '24px',
  }

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'outlined':
        return {
          border: '1px solid #e0e0e0',
          boxShadow: 'none',
        }
      case 'elevated':
        return {
          border: 'none',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        }
      default:
        return {
          border: 'none',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        }
    }
  }

  const containerStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    ...getVariantStyles(),
  }

  const headerStyle: React.CSSProperties = {
    padding: paddings[padding],
    borderBottom: title || subtitle ? '1px solid #f0f0f0' : 'none',
  }

  const contentStyle: React.CSSProperties = {
    padding: paddings[padding],
  }

  const footerStyle: React.CSSProperties = {
    padding: paddings[padding],
    borderTop: '1px solid #f0f0f0',
    backgroundColor: '#fafafa',
  }

  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: '18px',
    fontWeight: 500,
    color: '#333',
  }

  const subtitleStyle: React.CSSProperties = {
    margin: '4px 0 0 0',
    fontSize: '14px',
    color: '#666',
  }

  return (
    <div style={containerStyle} className={className}>
      {(title || subtitle) && (
        <div style={headerStyle}>
          {title && <h3 style={titleStyle}>{title}</h3>}
          {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
        </div>
      )}
      <div style={contentStyle}>{children}</div>
      {footer && <div style={footerStyle}>{footer}</div>}
    </div>
  )
}
