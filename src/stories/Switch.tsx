import React, { useState } from 'react'

interface SwitchProps {
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  size?: 'small' | 'medium' | 'large'
  label?: string
}

export const Switch = ({
  defaultChecked = false,
  onChange,
  disabled = false,
  size = 'medium',
  label,
}: SwitchProps) => {
  const [checked, setChecked] = useState(defaultChecked)

  const handleChange = () => {
    if (!disabled) {
      const newValue = !checked
      setChecked(newValue)
      onChange?.(newValue)
    }
  }

  const sizes = {
    small: { width: 36, height: 20, padding: 2 },
    medium: { width: 48, height: 26, padding: 3 },
    large: { width: 60, height: 32, padding: 4 },
  }

  const { width, height, padding } = sizes[size]
  const thumbSize = height - padding * 2

  const containerStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
  }

  const switchStyle: React.CSSProperties = {
    position: 'relative',
    width,
    height,
    backgroundColor: checked ? '#2196F3' : '#e0e0e0',
    borderRadius: height / 2,
    padding,
    transition: 'all 0.3s ease',
  }

  const thumbStyle: React.CSSProperties = {
    position: 'absolute',
    width: thumbSize,
    height: thumbSize,
    backgroundColor: 'white',
    borderRadius: '50%',
    transition: 'transform 0.3s ease',
    transform: `translateX(${checked ? width - thumbSize - padding * 2 : 0}px)`,
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  }

  return (
    <div style={containerStyle} onClick={handleChange}>
      <div style={switchStyle}>
        <div style={thumbStyle} />
      </div>
      {label && <span>{label}</span>}
    </div>
  )
}
