import React, { FormEvent } from 'react'

interface FormData {
  [key: string]: string
}

interface FormProps {
  children: React.ReactNode
  onSubmit: (data: FormData) => void
  validate?: (data: FormData) => Record<string, string>
}

export const Form = ({ children, onSubmit, validate }: FormProps) => {
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const data: FormData = {}

    formData.forEach((value, key) => {
      data[key] = value.toString()
    })

    if (validate) {
      const validationErrors = validate(data)
      setErrors(validationErrors)

      if (Object.keys(validationErrors).length > 0) {
        return
      }
    }

    onSubmit(data)
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
        maxWidth: '400px',
      }}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child

        if (child.type === 'input') {
          const name = child.props.name
          return (
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
            >
              {child}
              {errors[name] && (
                <span style={{ color: 'red', fontSize: '14px' }}>
                  {errors[name]}
                </span>
              )}
            </div>
          )
        }

        return child
      })}
    </form>
  )
}
