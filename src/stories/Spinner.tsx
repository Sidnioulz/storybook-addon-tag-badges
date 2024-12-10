import React from 'react'

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large'
  color?: string
  className?: string
}

export const Spinner = ({
  size = 'medium',
  color = '#2196F3',
  className,
}: SpinnerProps) => {
  const sizes = {
    small: 16,
    medium: 24,
    large: 32,
  }

  const pixelSize = sizes[size]
  const borderWidth = Math.max(2, pixelSize / 8)

  return (
    <div
      className={className}
      style={{
        width: pixelSize,
        height: pixelSize,
        border: `${borderWidth}px solid ${color}`,
        borderRightColor: 'transparent',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}
    >
      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  )
}
