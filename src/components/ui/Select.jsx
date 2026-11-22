// src/components/ui/Select.jsx
import { forwardRef, useId } from 'react'

const Select = forwardRef(function Select(
  { label, options = [], className = '', id, children, ...rest },
  ref,
) {
  const generatedId = useId()
  const selectId = id ?? generatedId

  return (
    <label htmlFor={selectId} className="flex flex-col gap-1 text-sm">
      {label && <span className="font-medium text-ink">{label}</span>}
      <select
        ref={ref}
        id={selectId}
        className={`w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-primary ${className}`}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        {children}
      </select>
    </label>
  )
})

export default Select
