import React from 'react'
import { Modal } from './Modal'

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
  size?: 'small' | 'medium' | 'large'
}

export const Dialog = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'medium',
}: DialogProps) => {
  const sizeMap = {
    small: '400px',
    medium: '600px',
    large: '800px',
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          width: '90%',
          maxWidth: sizeMap[size],
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <header
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid #eee',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              padding: '4px',
              cursor: 'pointer',
              fontSize: '1.5rem',
              lineHeight: 1,
              color: '#666',
            }}
            aria-label="Close dialog"
          >
            ×
          </button>
        </header>

        <div
          style={{
            padding: '24px',
            overflowY: 'auto',
            flexGrow: 1,
          }}
        >
          {children}
        </div>

        {footer && (
          <footer
            style={{
              padding: '16px 24px',
              borderTop: '1px solid #eee',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '8px',
            }}
          >
            {footer}
          </footer>
        )}
      </div>
    </Modal>
  )
}
