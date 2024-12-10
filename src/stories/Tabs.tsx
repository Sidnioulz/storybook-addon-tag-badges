import React, { createContext, useContext, useState } from 'react'

interface TabsContextType {
  activeTab: string
  setActiveTab: (id: string) => void
}

const TabsContext = createContext<TabsContextType | undefined>(undefined)

interface TabsProps {
  defaultTab?: string
  children: React.ReactNode
  variant?: 'default' | 'underline' | 'pills'
}

export const Tabs = ({
  defaultTab,
  children,
  variant = 'default',
}: TabsProps) => {
  // Find first tab ID from children for default active tab
  const firstTabId =
    React.Children.toArray(children).find(
      (child): child is React.ReactElement => React.isValidElement(child),
    )?.props?.id || ''

  const [activeTab, setActiveTab] = useState(defaultTab || firstTabId)

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  }

  const tabListStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    borderBottom: variant === 'underline' ? '1px solid #e0e0e0' : 'none',
    padding: variant === 'underline' ? '0 0 1px 0' : '0',
  }

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div style={containerStyle}>
        <div style={tabListStyle} role="tablist">
          {React.Children.map(children, (child) => {
            if (React.isValidElement<TabItemProps>(child)) {
              return React.cloneElement(child, {
                ...child.props,
                variant,
              })
            }
            return child
          })}
        </div>
      </div>
    </TabsContext.Provider>
  )
}

interface TabItemProps {
  id: string
  label: string
  variant?: 'default' | 'underline' | 'pills'
  disabled?: boolean
  children?: React.ReactNode
}

export const TabItem = ({
  id,
  label,
  variant = 'default',
  disabled = false,
  children,
}: TabItemProps) => {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('TabItem must be used within a Tabs component')
  }

  const { activeTab, setActiveTab } = context
  const isActive = activeTab === id

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'underline':
        return {
          borderBottom: isActive
            ? '2px solid #2196F3'
            : '2px solid transparent',
          marginBottom: '-1px',
        }
      case 'pills':
        return {
          backgroundColor: isActive ? '#2196F3' : 'transparent',
          color: isActive ? 'white' : 'inherit',
          borderRadius: '16px',
        }
      default:
        return {
          backgroundColor: isActive ? '#f0f0f0' : 'transparent',
          borderRadius: '4px',
        }
    }
  }

  const tabStyle: React.CSSProperties = {
    padding: '8px 16px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.2s ease',
    ...getVariantStyles(),
  }

  const handleClick = () => {
    if (!disabled) {
      setActiveTab(id)
    }
  }

  return (
    <>
      <div
        role="tab"
        aria-selected={isActive}
        aria-disabled={disabled}
        style={tabStyle}
        onClick={handleClick}
      >
        {label}
      </div>
      {isActive && children && <div role="tabpanel">{children}</div>}
    </>
  )
}
