import React, { useState } from 'react'

interface CheckboxProps {
  label?: string
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  indeterminate?: boolean
  onChange?: (checked: boolean) => void
  size?: 'small' | 'medium' | 'large'
  error?: boolean
  helper?: string
}

export const Checkbox = ({
  label,
  checked: controlledChecked,
  defaultChecked = false,
  disabled = false,
  indeterminate = false,
  onChange,
  size = 'medium',
  error = false,
  helper,
}: CheckboxProps) => {
  const [internalChecked, setInternalChecked] = useState(defaultChecked)
  const isControlled = controlledChecked !== undefined
  const isChecked = isControlled ? controlledChecked : internalChecked

  const sizes = {
    small: { box: 16, checkmark: 12 },
    medium: { box: 20, checkmark: 14 },
    large: { box: 24, checkmark: 16 },
  }

  const containerStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'flex-start',
    gap: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
  }

  const checkboxStyle: React.CSSProperties = {
    position: 'relative',
    width: sizes[size].box,
    height: sizes[size].box,
    border: `2px solid ${error ? '#f44336' : isChecked ? '#2196F3' : '#757575'}`,
    borderRadius: '4px',
    backgroundColor: isChecked ? '#2196F3' : 'white',
    transition: 'all 0.2s',
  }

  const checkmarkStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: sizes[size].checkmark,
    height: sizes[size].checkmark,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: size === 'small' ? '14px' : size === 'large' ? '16px' : '15px',
    userSelect: 'none',
  }

  const helperStyle: React.CSSProperties = {
    fontSize: '12px',
    color: error ? '#f44336' : '#757575',
    marginTop: '4px',
  }

  const handleChange = () => {
    if (!disabled) {
      const newValue = !isChecked
      if (!isControlled) {
        setInternalChecked(newValue)
      }
      onChange?.(newValue)
    }
  }

  const renderIcon = () => {
    if (indeterminate) {
      return <span style={{ fontSize: sizes[size].checkmark }}>─</span>
    }
    if (isChecked) {
      return <span style={{ fontSize: sizes[size].checkmark }}>✓</span>
    }
    return null
  }

  return (
    <div>
      <div style={containerStyle} onClick={handleChange}>
        <div style={checkboxStyle}>
          <div style={checkmarkStyle}>{renderIcon()}</div>
        </div>
        {label && <span style={labelStyle}>{label}</span>}
      </div>
      {helper && <div style={helperStyle}>{helper}</div>}
    </div>
  )
}
