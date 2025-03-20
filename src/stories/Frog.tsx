import React from 'react'
import './frog.css'

interface FrogProps {
  /**
   * How big is your frog!?
   */
  size?: 'small' | 'big'

  /**
   * What does your frog prefer to eat?
   */
  preferredInsects?: string[]
}

/**
 * Primary UI component for user interaction
 */
export const Frog = ({
  size = 'big',
  preferredInsects = ['flies', 'butterflies', 'aphids'],
}: FrogProps) => {
  const id = React.useId()
  const anchorId = '--' + id.replace(/:/g, '') + '-insect-anchor'
  const popoverId = id + '-insect-popover'

  return (
    <span
      role="img"
      aria-label="Frog"
      className={['frog', `frog--size_${size}`].join(' ')}
      style={{ '--anchor-id': anchorId }}
    >
      <span className="frog__frog">🐸</span>
      {preferredInsects.length > 0 && (
        <>
          <button
            className="frog__diet"
            aria-label="Show preferred diet"
            popoverTarget={popoverId}
          >
            💭
          </button>
          <div id={popoverId} className="frog__diet-menu" popover="auto">
            <ul>
              {preferredInsects.map((insect, index) => (
                <li key={index}>{insect}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </span>
  )
}
