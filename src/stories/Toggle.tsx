import React, { useState } from 'react'

interface ToggleProps {
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  size?: 'small' | 'medium' | 'large'
  label?: string
}

export const Toggle = ({
  defaultChecked = false,
  onChange,
  disabled = false,
  size = 'medium',
  label,
}: ToggleProps) => {
  const [checked, setChecked] = useState(defaultChecked)

  const handleChange = () => {
    if (!disabled) {
      const newValue = !checked
      setChecked(newValue)
      onChange?.(newValue)
    }
  }

  const sizes = {
    small: { width: 32, height: 16, circle: 12 },
    medium: { width: 44, height: 22, circle: 18 },
    large: { width: 56, height: 28, circle: 24 },
  }

  const { width, height, circle } = sizes[size]

  const containerStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
  }

  const toggleStyle: React.CSSProperties = {
    position: 'relative',
    width,
    height,
    backgroundColor: checked ? '#4CAF50' : '#ccc',
    borderRadius: height,
    transition: 'background-color 0.2s',
  }

  const circleStyle: React.CSSProperties = {
    position: 'absolute',
    top: (height - circle) / 2,
    left: checked
      ? width - circle - (height - circle) / 2
      : (height - circle) / 2,
    width: circle,
    height: circle,
    backgroundColor: 'white',
    borderRadius: '50%',
    transition: 'left 0.2s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  }

  return (
    <div style={containerStyle} onClick={handleChange}>
      <div style={toggleStyle}>
        <div style={circleStyle} />
      </div>
      {label && <span>{label}</span>}
    </div>
  )
}
