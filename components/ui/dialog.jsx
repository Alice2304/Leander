"use client"

import * as React from "react"

export function Dialog({ open, onOpenChange, children }) {
  return open ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 relative max-w-lg w-full">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          onClick={() => onOpenChange(false)}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  ) : null
}

export function DialogTrigger({ asChild, children, ...props }) {
  return React.cloneElement(children, {
    onClick: (e) => {
      if (children.props.onClick) children.props.onClick(e)
      if (props.onClick) props.onClick(e)
    },
  })
}

export function DialogContent({ children }) {
  return <div>{children}</div>
}

export function DialogHeader({ children }) {
  return <div className="mb-4">{children}</div>
}

export function DialogTitle({ children }) {
  return <h2 className="text-lg font-bold mb-2">{children}</h2>
}
