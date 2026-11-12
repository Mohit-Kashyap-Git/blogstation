// Shared styling for text inputs, textareas, and selects.
export function controlClass(hasError) {
  return `w-full rounded-lg border bg-white px-3 py-2.5 text-sm placeholder:text-slate-400 focus-visible:outline-2 focus-visible:outline-indigo-500 dark:bg-slate-950 ${
    hasError ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
  }`
}

function FormField({ id, label, error, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{hint}</p>}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}

export default FormField