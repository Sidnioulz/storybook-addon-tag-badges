import React from 'react'

interface InputDateProps {
  value: string
  onChange: (value: string) => void
  min?: string
  max?: string
  disabled?: boolean
  required?: boolean
  label?: string
  className?: string
}

export const InputDate = ({
  value,
  onChange,
  min,
  max,
  disabled = false,
  required = false,
  label,
  className,
}: InputDateProps) => {
  return (
    <div
      className={className}
      style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
    >
      {label && (
        <label style={{ fontSize: '14px', color: disabled ? '#666' : '#333' }}>
          {label}
          {required && <span style={{ color: '#f44336' }}> *</span>}
        </label>
      )}
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        disabled={disabled}
        required={required}
        style={{
          padding: '8px 12px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '16px',
          opacity: disabled ? 0.7 : 1,
        }}
      />
    </div>
  )
}
