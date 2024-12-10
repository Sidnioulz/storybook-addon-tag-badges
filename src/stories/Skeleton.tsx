import React from 'react'

interface SkeletonProps {
  width: string
  height: string
  variant?: 'rectangle' | 'circle'
}

export const Skeleton = ({
  width,
  height,
  variant = 'rectangle',
}: SkeletonProps) => {
  const baseStyles: React.CSSProperties = {
    width,
    height,
    backgroundColor: '#e0e0e0',
    animation: 'pulse 1.5s ease-in-out infinite',
  }

  const variantStyles: React.CSSProperties =
    variant === 'circle' ? { borderRadius: '50%' } : { borderRadius: '4px' }

  return (
    <div
      style={{
        ...baseStyles,
        ...variantStyles,
      }}
    />
  )
}
