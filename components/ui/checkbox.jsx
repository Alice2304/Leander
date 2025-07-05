import React from "react"

// Componente Checkbox básico compatible con shadcn/ui

// Permite usar onCheckedChange como en shadcn/ui
export const Checkbox = React.forwardRef(({ className = "", onCheckedChange, checked, ...props }, ref) => (
  <input
    type="checkbox"
    ref={ref}
    className={`rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 ${className}`}
    checked={checked}
    onChange={e => onCheckedChange ? onCheckedChange(e.target.checked) : undefined}
    {...props}
  />
))

Checkbox.displayName = "Checkbox"

export default Checkbox
