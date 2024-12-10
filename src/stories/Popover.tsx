import React, { useRef } from 'react'
import { Modal } from './Modal'

interface PopoverProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  trigger: React.ReactElement
  placement?: 'top' | 'right' | 'bottom' | 'left'
}

export const Popover = ({
  isOpen,
  onClose,
  children,
  trigger,
  placement = 'bottom',
}: PopoverProps) => {
  const triggerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const getPopoverPosition = () => {
    if (!triggerRef.current || !contentRef.current) return {}

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const contentRect = contentRef.current.getBoundingClientRect()

    const positions = {
      top: {
        top: triggerRect.top - contentRect.height - 8,
        left: triggerRect.left + (triggerRect.width - contentRect.width) / 2,
      },
      right: {
        top: triggerRect.top + (triggerRect.height - contentRect.height) / 2,
        left: triggerRect.right + 8,
      },
      bottom: {
        top: triggerRect.bottom + 8,
        left: triggerRect.left + (triggerRect.width - contentRect.width) / 2,
      },
      left: {
        top: triggerRect.top + (triggerRect.height - contentRect.height) / 2,
        left: triggerRect.left - contentRect.width - 8,
      },
    }

    return positions[placement]
  }

  return (
    <>
      <div ref={triggerRef}>
        {React.cloneElement(trigger, {
          onClick: (e: React.MouseEvent) => {
            e.stopPropagation()
            if (trigger.props.onClick) trigger.props.onClick(e)
            if (!isOpen) onClose()
          },
        })}
      </div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div
          ref={contentRef}
          style={{
            position: 'fixed',
            backgroundColor: 'white',
            padding: '12px',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            zIndex: 1001,
            minWidth: '200px',
            ...getPopoverPosition(),
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </Modal>
    </>
  )
}
