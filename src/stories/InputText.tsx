import React, { useState } from 'react'

interface InputTextProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  helper?: string
  size?: 'small' | 'medium' | 'large'
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const InputText = ({
  label,
  error,
  helper,
  size = 'medium',
  leftIcon,
  rightIcon,
  disabled = false,
  ...props
}: InputTextProps) => {
  const [focused, setFocused] = useState(false)

  const sizes = {
    small: { padding: '6px 12px', fontSize: '14px' },
    medium: { padding: '8px 16px', fontSize: '16px' },
    large: { padding: '12px 20px', fontSize: '18px' },
  }

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  }

  const inputWrapperStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    border: `2px solid ${error ? '#f44336' : focused ? '#2196F3' : '#e0e0e0'}`,
    borderRadius: '4px',
    outline: 'none',
    transition: 'all 0.2s',
    opacity: disabled ? 0.6 : 1,
    backgroundColor: disabled ? '#f5f5f5' : 'white',
    ...sizes[size],
    paddingLeft: leftIcon ? '36px' : sizes[size].padding,
    paddingRight: rightIcon ? '36px' : sizes[size].padding,
  }

  const iconStyle = (position: 'left' | 'right'): React.CSSProperties => ({
    position: 'absolute',
    [position]: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: error ? '#f44336' : focused ? '#2196F3' : '#757575',
    pointerEvents: 'none',
  })

  const messageStyle: React.CSSProperties = {
    fontSize: '14px',
    color: error ? '#f44336' : '#757575',
    marginTop: '4px',
  }

  return (
    <div style={containerStyle}>
      {label && (
        <label style={{ color: disabled ? '#999' : '#333' }}>{label}</label>
      )}
      <div style={inputWrapperStyle}>
        {leftIcon && <div style={iconStyle('left')}>{leftIcon}</div>}
        <input
          {...props}
          disabled={disabled}
          style={inputStyle}
          onFocus={(e) => {
            setFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setFocused(false)
            props.onBlur?.(e)
          }}
        />
        {rightIcon && <div style={iconStyle('right')}>{rightIcon}</div>}
      </div>
      {(error || helper) && <span style={messageStyle}>{error || helper}</span>}
    </div>
  )
}
