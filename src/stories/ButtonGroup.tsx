import React from 'react'

interface ButtonGroupProps {
  children: React.ReactNode
  variant?: 'default' | 'outlined' | 'text'
  size?: 'small' | 'medium' | 'large'
  orientation?: 'horizontal' | 'vertical'
  fullWidth?: boolean
  disabled?: boolean
}

interface ButtonGroupButtonProps {
  children: React.ReactNode
  active?: boolean
  disabled?: boolean
  onClick?: () => void
}

export const ButtonGroupButton = ({
  children,
  disabled = false,
  onClick,
}: ButtonGroupButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {children}
    </button>
  )
}

export const ButtonGroup = ({
  children,
  variant = 'default',
  size = 'medium',
  orientation = 'horizontal',
  fullWidth = false,
  disabled = false,
}: ButtonGroupProps) => {
  const sizes = {
    small: { padding: '6px 12px', fontSize: '14px' },
    medium: { padding: '8px 16px', fontSize: '16px' },
    large: { padding: '12px 24px', fontSize: '18px' },
  }

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderColor: '#2196F3',
          color: '#2196F3',
        }
      case 'text':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          color: '#2196F3',
        }
      default:
        return {
          backgroundColor: '#2196F3',
          borderColor: '#2196F3',
          color: 'white',
        }
    }
  }

  const containerStyle: React.CSSProperties = {
    display: 'inline-flex',
    flexDirection: orientation === 'vertical' ? 'column' : 'row',
    width: fullWidth ? '100%' : 'auto',
  }

  const getChildStyle = (index: number): React.CSSProperties => {
    const isFirst = index === 0
    const isLast = index === React.Children.count(children) - 1
    const borderRadius =
      orientation === 'horizontal'
        ? `${isFirst ? '4px' : '0'} ${isLast ? '4px' : '0'} ${isLast ? '4px' : '0'} ${isFirst ? '4px' : '0'}`
        : `${isFirst ? '4px' : '0'} ${isFirst ? '4px' : '0'} ${isLast ? '4px' : '0'} ${isLast ? '4px' : '0'}`

    return {
      flex: fullWidth ? 1 : 'none',
      margin: 0,
      padding: sizes[size].padding,
      fontSize: sizes[size].fontSize,
      border: '1px solid',
      borderRadius,
      ...getVariantStyles(),
      borderRightWidth: orientation === 'horizontal' && !isLast ? 0 : 1,
      borderBottomWidth: orientation === 'vertical' && !isLast ? 0 : 1,
    }
  }

  return (
    <div style={containerStyle}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return null

        return React.cloneElement(child, {
          style: {
            ...getChildStyle(index),
            ...(child.props.style || {}),
          },
          disabled: disabled || child.props.disabled,
        })
      })}
    </div>
  )
}
