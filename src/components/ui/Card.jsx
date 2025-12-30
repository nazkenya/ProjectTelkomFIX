import React from 'react'

export default function Card({ children, className = '', onClick }) {
  const isInteractive = typeof onClick === 'function'

  const handleKeyDown = (event) => {
    if (!isInteractive) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick(event)
    }
  }

  return (
    <div
      className={`bg-white rounded-xl shadow-card p-6 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 ${isInteractive ? 'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#E60012]' : ''} ${className}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
    >
      {children}
    </div>
  )
}
