import React from 'react'

interface RatingProps {
  value: number
  maxValue: number
  readOnly?: boolean
}

export const Rating = ({ value, maxValue, readOnly = false }: RatingProps) => {
  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {Array.from({ length: maxValue }).map((_, index) => (
        <span
          key={index}
          style={{
            color: index < value ? 'gold' : 'gray',
            cursor: readOnly ? 'default' : 'pointer',
            fontSize: '24px',
          }}
        >
          ★
        </span>
      ))}
    </div>
  )
}
