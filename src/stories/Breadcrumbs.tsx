import React from 'react'

interface BreadcrumbsProps {
  children: React.ReactNode
  separator?: React.ReactNode
  maxItems?: number
  itemsBeforeCollapse?: number
  itemsAfterCollapse?: number
}

interface BreadcrumbItemProps {
  href?: string
  current?: boolean
  children: React.ReactNode
}

export const BreadcrumbItem = ({
  href,
  current = false,
  children,
}: BreadcrumbItemProps) => {
  const style: React.CSSProperties = {
    color: current ? '#333' : '#2196F3',
    textDecoration: 'none',
    fontWeight: current ? 500 : 400,
    cursor: current ? 'default' : 'pointer',
  }

  if (href && !current) {
    return (
      <a href={href} style={style}>
        {children}
      </a>
    )
  }

  return <span style={style}>{children}</span>
}

export const Breadcrumbs = ({
  children,
  separator = '/',
  maxItems = 8,
  itemsBeforeCollapse = 1,
  itemsAfterCollapse = 1,
}: BreadcrumbsProps) => {
  const items = React.Children.toArray(children)
  const totalItems = items.length
  const shouldCollapse = maxItems > 0 && totalItems > maxItems

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '8px',
    fontSize: '14px',
  }

  const separatorStyle: React.CSSProperties = {
    color: '#757575',
    userSelect: 'none',
  }

  const ellipsisStyle: React.CSSProperties = {
    color: '#757575',
    cursor: 'default',
  }

  const renderSeparator = (index: number) => {
    if (index < items.length - 1) {
      return <span style={separatorStyle}>{separator}</span>
    }
    return null
  }

  if (shouldCollapse) {
    const beforeItems = items.slice(0, itemsBeforeCollapse)
    const afterItems = items.slice(totalItems - itemsAfterCollapse)

    return (
      <nav style={containerStyle}>
        {beforeItems.map((item, index) => (
          <React.Fragment key={index}>
            {item}
            {renderSeparator(index)}
          </React.Fragment>
        ))}
        <span style={ellipsisStyle}>...</span>
        {afterItems.map((item, index) => (
          <React.Fragment key={index + totalItems - itemsAfterCollapse}>
            {renderSeparator(itemsBeforeCollapse - 1)}
            {item}
            {renderSeparator(totalItems - itemsAfterCollapse + index)}
          </React.Fragment>
        ))}
      </nav>
    )
  }

  return (
    <nav style={containerStyle}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item}
          {renderSeparator(index)}
        </React.Fragment>
      ))}
    </nav>
  )
}
