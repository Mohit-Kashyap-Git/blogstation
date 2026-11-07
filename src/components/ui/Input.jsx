import { forwardRef, useId } from 'react'

// forwardRef lets React Hook Form attach its ref to the real <input>.
const Input = forwardRef(function Input({ label, error, ...props }, ref) {
  const id = useId()
  const errorId = `${id}-error`

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        ref={ref}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? errorId : undefined}
        className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm placeholder:text-slate-400 focus-visible:outline-2 focus-visible:outline-indigo-500 dark:bg-slate-950 ${
          error ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
        }`}
        {...props}
      />
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
})

export default Input