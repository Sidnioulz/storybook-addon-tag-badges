import React from 'react'

interface QuoteProps {
  text: string
  author?: string
  citation?: string
  className?: string
}

export const Quote = ({ text, author, citation, className }: QuoteProps) => {
  return (
    <figure
      className={className}
      style={{
        maxWidth: '600px',
        margin: '20px 0',
        padding: '20px',
        borderLeft: '4px solid #2196F3',
        backgroundColor: '#f5f5f5',
      }}
    >
      <blockquote
        style={{
          margin: '0 0 10px 0',
          fontSize: '18px',
          fontStyle: 'italic',
        }}
      >
        {text}
      </blockquote>
      {(author || citation) && (
        <figcaption style={{ fontSize: '14px' }}>
          {author && <cite style={{ fontWeight: 'bold' }}>{author}</cite>}
          {author && citation && ', '}
          {citation && <span>{citation}</span>}
        </figcaption>
      )}
    </figure>
  )
}
