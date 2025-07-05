"use client"

import * as React from "react"

export function Textarea({ id, value, onChange, className = "", placeholder = "", rows = 3 }) {
  return (
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      className={`w-full p-2 rounded bg-gray-700 border-gray-600 text-white resize-none ${className}`}
      placeholder={placeholder}
      rows={rows}
    />
  )
}
