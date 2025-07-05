"use client"

import * as React from "react"

export function Select({ value, onValueChange, children }) {
  return (
    <select
      className="w-full p-2 rounded bg-gray-700 border-gray-600 text-white"
      value={value}
      onChange={e => onValueChange(e.target.value)}
    >
      {children}
    </select>
  )
}

export function SelectTrigger({ children, ...props }) {
  return <div {...props}>{children}</div>
}

export function SelectValue({ placeholder }) {
  return <option value="" disabled hidden>{placeholder}</option>
}

export function SelectContent({ children }) {
  return <>{children}</>
}

export function SelectItem({ value, children }) {
  return <option value={value}>{children}</option>
}
