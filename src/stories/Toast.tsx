import React, { useEffect } from 'react'

interface ToastProps {
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  isVisible: boolean
  onClose: () => void
  duration?: number
}

export const Toast = ({
  type,
  message,
  isVisible,
  onClose,
  duration = 3000,
}: ToastProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  if (!isVisible) return null

  const colors = {
    success: { bg: '#4caf50', text: 'white' },
    error: { bg: '#f44336', text: 'white' },
    info: { bg: '#2196f3', text: 'white' },
    warning: { bg: '#ff9800', text: 'white' },
  }

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: colors[type].bg,
        color: colors[type].text,
        padding: '12px 24px',
        borderRadius: '4px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        zIndex: 1000,
        animation: 'slideIn 0.3s ease-out',
      }}
    >
      <span style={{ fontSize: '18px' }}>{icons[type]}</span>
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'inherit',
          fontSize: '18px',
          cursor: 'pointer',
          padding: '0 0 0 16px',
          opacity: 0.8,
          lineHeight: 1,
        }}
      >
        ×
      </button>
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  )
}
