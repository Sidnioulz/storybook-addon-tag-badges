import React from 'react'

interface FileUploadProps {
  accept?: string
  multiple?: boolean
  maxSize?: number
  onUpload: (files: File[]) => void
  disabled?: boolean
  label?: string
  className?: string
}

export const FileUpload = ({
  accept,
  multiple = false,
  maxSize,
  onUpload,
  disabled = false,
  label = 'Choose file',
  className,
}: FileUploadProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = React.useState(false)

  const handleFiles = (files: FileList) => {
    const validFiles = Array.from(files).filter((file) => {
      if (maxSize && file.size > maxSize) return false
      return true
    })
    onUpload(validFiles)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    if (disabled) return
    handleFiles(e.dataTransfer.files)
  }

  const containerStyle: React.CSSProperties = {
    border: `2px dashed ${dragActive ? '#2196F3' : '#ccc'}`,
    borderRadius: '4px',
    padding: '20px',
    textAlign: 'center',
    cursor: disabled ? 'not-allowed' : 'pointer',
    backgroundColor: disabled
      ? '#f5f5f5'
      : dragActive
        ? 'rgba(33, 150, 243, 0.1)'
        : 'white',
    opacity: disabled ? 0.7 : 1,
  }

  return (
    <div
      className={className}
      style={containerStyle}
      onDragOver={(e) => {
        e.preventDefault()
        if (!disabled) setDragActive(true)
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
        style={{ display: 'none' }}
        disabled={disabled}
      />
      <p style={{ margin: 0 }}>
        {label}
        <br />
        <span style={{ fontSize: '14px', color: '#666' }}>
          or drag and drop files here
        </span>
      </p>
    </div>
  )
}
