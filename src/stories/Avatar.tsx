import React from 'react'

interface AvatarProps {
  src?: string
  alt?: string
  size?: 'small' | 'medium' | 'large'
  fallback?: string
  className?: string
}

export const Avatar = ({
  src,
  alt = '',
  size = 'medium',
  fallback,
  className,
}: AvatarProps) => {
  const [error, setError] = React.useState(false)

  const sizes = {
    small: 32,
    medium: 40,
    large: 56,
  }

  const pixelSize = sizes[size]

  const getFallbackInitials = () => {
    if (fallback) return fallback.slice(0, 2).toUpperCase()
    if (alt)
      return alt
        .split(' ')
        .map((word) => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    return '?'
  }

  const containerStyle: React.CSSProperties = {
    width: pixelSize,
    height: pixelSize,
    borderRadius: '50%',
    overflow: 'hidden',
    backgroundColor: '#e0e0e0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: `${pixelSize * 0.4}px`,
    color: '#666',
    fontWeight: 500,
  }

  return (
    <div className={className} style={containerStyle}>
      {src && !error ? (
        <img
          src={src}
          alt={alt}
          onError={() => setError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        getFallbackInitials()
      )}
    </div>
  )
}
