import React from 'react'
import { Modal } from './Modal'

interface DrawerProps {
  isOpen: boolean
  position?: 'left' | 'right'
  children: React.ReactNode
  onClose: () => void
}

export const Drawer = ({
  isOpen,
  position = 'left',
  children,
  onClose,
}: DrawerProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div
        style={{
          position: 'fixed',
          top: 0,
          [position]: 0,
          width: '300px',
          height: '100vh',
          backgroundColor: 'white',
          boxShadow:
            position === 'left'
              ? '2px 0 5px rgba(0, 0, 0, 0.1)'
              : '-2px 0 5px rgba(0, 0, 0, 0.1)',
          padding: '20px',
          transform: isOpen
            ? 'translateX(0)'
            : `translateX(${position === 'left' ? '-100%' : '100%'})`,
          transition: 'transform 0.3s ease-in-out',
          overflowY: 'auto',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '4px',
            lineHeight: 1,
          }}
        >
          ×
        </button>
        <div style={{ marginTop: '40px' }}>{children}</div>
      </div>
    </Modal>
  )
}
