import { useEffect, useState } from 'react'

const accent = {
  success: 'bg-emerald-500',
  error: 'bg-red-500',
  info: 'bg-sky-500',
}

// Errors stay longer, because they usually need to be read and acted on.
const durations = { success: 5000, info: 7000, error: 8000 }

function Toast({ toast, onDismiss }) {
  const [paused, setPaused] = useState(false)

  // Auto-dismiss, but not while the user is hovering or focusing the toast.
  useEffect(() => {
    if (paused) return
    const timer = setTimeout(() => onDismiss(toast.id), durations[toast.tone])
    return () => clearTimeout(timer)
  }, [paused, toast.id, toast.tone, onDismiss])

  return (
    <div
      role={toast.tone === 'error' ? 'alert' : undefined}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="pointer-events-auto flex w-full max-w-sm items-stretch gap-3 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-800 shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
    >
      {/* A separate bar (not a colored border), so it can't clash with the border color. */}
      <span className={`w-1 shrink-0 rounded-full ${accent[toast.tone]}`} aria-hidden="true" />
      <p className="flex-1 py-0.5">{toast.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="self-start rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-indigo-500 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>
  )
}

export default Toast