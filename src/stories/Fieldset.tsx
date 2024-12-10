import React from 'react'

interface FieldsetProps {
  legend?: string
  children: React.ReactNode
  disabled?: boolean
  error?: string
  helper?: string
  required?: boolean
  className?: string
}

export const Fieldset = ({
  legend,
  children,
  disabled = false,
  error,
  helper,
  required = false,
  className,
}: FieldsetProps) => {
  const containerStyle: React.CSSProperties = {
    border: `1px solid ${error ? '#f44336' : '#e0e0e0'}`,
    borderRadius: '4px',
    padding: '16px',
    opacity: disabled ? 0.5 : 1,
  }

  const legendStyle: React.CSSProperties = {
    padding: '0 8px',
    color: error ? '#f44336' : '#333',
    fontWeight: 500,
  }

  const messageStyle: React.CSSProperties = {
    fontSize: '14px',
    color: error ? '#f44336' : '#757575',
    marginTop: '8px',
  }

  const contentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  }

  const requiredStyle: React.CSSProperties = {
    color: '#f44336',
    marginLeft: '4px',
  }

  return (
    <fieldset style={containerStyle} disabled={disabled} className={className}>
      {legend && (
        <legend style={legendStyle}>
          {legend}
          {required && <span style={requiredStyle}>*</span>}
        </legend>
      )}
      <div style={contentStyle}>{children}</div>
      {(error || helper) && <div style={messageStyle}>{error || helper}</div>}
    </fieldset>
  )
}
