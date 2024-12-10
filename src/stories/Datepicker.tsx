import React, { useState } from 'react'

interface DatepickerProps {
  value?: Date
  onChange?: (date: Date) => void
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
}

export const Datepicker = ({
  value,
  onChange,
  disabled = false,
  minDate,
  maxDate,
}: DatepickerProps) => {
  const [currentDate, setCurrentDate] = useState(value || new Date())
  const [selectedDate, setSelectedDate] = useState(value)

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const isDateDisabled = (date: Date) => {
    if (disabled) return true
    if (minDate && date < minDate) return true
    if (maxDate && date > maxDate) return true
    return false
  }

  const handleDateClick = (day: number) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    )
    if (!isDateDisabled(newDate)) {
      setSelectedDate(newDate)
      onChange?.(newDate)
    }
  }

  const changeMonth = (offset: number) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1),
    )
  }

  const containerStyle: React.CSSProperties = {
    width: '280px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '16px',
  }

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  }

  const buttonStyle: React.CSSProperties = {
    border: 'none',
    background: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    padding: '4px 8px',
    opacity: disabled ? 0.5 : 1,
  }

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '4px',
    textAlign: 'center',
  }

  const dayStyle = (
    isSelected: boolean,
    isDisabled: boolean,
  ): React.CSSProperties => ({
    padding: '8px',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    backgroundColor: isSelected ? '#2196F3' : 'transparent',
    color: isDisabled ? '#ccc' : isSelected ? 'white' : '#333',
    borderRadius: '4px',
    border: 'none',
  })

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <button
          style={buttonStyle}
          onClick={() => changeMonth(-1)}
          disabled={disabled}
        >
          ←
        </button>
        <span>
          {currentDate.toLocaleString('default', {
            month: 'long',
            year: 'numeric',
          })}
        </span>
        <button
          style={buttonStyle}
          onClick={() => changeMonth(1)}
          disabled={disabled}
        >
          →
        </button>
      </div>
      <div style={gridStyle}>
        {weekDays.map((day) => (
          <div key={day} style={{ padding: '8px', fontWeight: 'bold' }}>
            {day}
          </div>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map((day) => {
          const date = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            day,
          )
          const isSelected = selectedDate?.getTime() === date.getTime()
          const isDisabled = isDateDisabled(date)
          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              disabled={isDisabled}
              style={dayStyle(isSelected, isDisabled)}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}
