"use client"
import * as React from "react"

function Tabs({ defaultValue, className, children }) {
  const [value, setValue] = React.useState(defaultValue)
  // Clona los hijos y pasa el valor y el setter
  return (
    <div className={className} data-tabs>
      {React.Children.map(children, child => {
        if (!React.isValidElement(child)) return child
        return React.cloneElement(child, { value, setValue })
      })}
    </div>
  )
}

function TabsList({ children, className, value, setValue }) {
  return (
    <div className={className} role="tablist">
      {React.Children.map(children, child => {
        if (!React.isValidElement(child)) return child
        return React.cloneElement(child, { value, setValue })
      })}
    </div>
  )
}

function TabsTrigger({ value: triggerValue, className, children, value, setValue }) {
  const isActive = value === triggerValue
  return (
    <button
      type="button"
      className={className}
      data-state={isActive ? "active" : undefined}
      role="tab"
      aria-selected={isActive}
      onClick={() => setValue(triggerValue)}
    >
      {children}
    </button>
  )
}

function TabsContent({ value: contentValue, value, children, className }) {
  if (value !== contentValue) return null
  return (
    <div className={className} role="tabpanel">
      {children}
    </div>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
