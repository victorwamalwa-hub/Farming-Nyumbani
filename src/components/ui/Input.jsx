// src/components/ui/Input.jsx
import { forwardRef, useId } from 'react'

const Input = forwardRef(function Input(
  { label, className = '', id, ...rest },
  ref,
) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <label htmlFor={inputId} className="flex flex-col gap-1 text-sm">
      {label && <span className="font-medium text-ink">{label}</span>}
      <input
        ref={ref}
        id={inputId}
        className={`w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-primary ${className}`}
        {...rest}
      />
    </label>
  )
})

export default Input
