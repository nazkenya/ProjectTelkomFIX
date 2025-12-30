import React from 'react'

export default function Modal({ open, onClose, title, children, footer, panelClassName = '' }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative z-10 flex h-full w-full overflow-y-auto px-4 py-10 sm:px-6">
        <div className="flex w-full flex-col items-center justify-center">
          <div
            className={`w-full ${panelClassName || 'max-w-md'} rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 animate-slide-up flex max-h-[calc(100vh-4rem)] flex-col overflow-hidden`}
          >
            <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="text-base font-semibold text-neutral-900">{title}</h3>
              <button
                className="w-8 h-8 rounded-lg hover:bg-neutral-100 text-neutral-500"
                onClick={onClose}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 text-sm text-neutral-700 bg-white">
              {children}
            </div>
            {footer && (
              <div className="px-5 py-3 border-t border-neutral-100 bg-neutral-50">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
