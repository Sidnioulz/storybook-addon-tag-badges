import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  size?: 'small' | 'medium' | 'large'
  children: React.ReactNode
}

export const Button = ({
  variant = 'primary',
  size = 'medium',
  children,
  disabled,
  ...props
}: ButtonProps) => {
  const baseStyles: React.CSSProperties = {
    border: 'none',
    borderRadius: '4px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'sans-serif',
    fontWeight: 500,
    transition: 'background-color 0.2s, opacity 0.2s',
    opacity: disabled ? 0.6 : 1,
  }

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: '#007bff',
      color: 'white',
    },
    secondary: {
      backgroundColor: '#6c757d',
      color: 'white',
    },
  }

  const sizeStyles: Record<string, React.CSSProperties> = {
    small: {
      padding: '6px 12px',
      fontSize: '14px',
    },
    medium: {
      padding: '8px 16px',
      fontSize: '16px',
    },
    large: {
      padding: '12px 24px',
      fontSize: '18px',
    },
  }

  return (
    <button
      style={{
        ...baseStyles,
        ...variantStyles[variant],
        ...sizeStyles[size],
      }}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
