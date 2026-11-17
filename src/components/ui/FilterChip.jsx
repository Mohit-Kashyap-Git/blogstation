const base =
  'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-indigo-500'
const active = 'border-indigo-600 bg-indigo-600 text-white'
const idle =
  'border-slate-300 hover:border-indigo-500 hover:text-indigo-600 dark:border-slate-700 dark:hover:border-indigo-400 dark:hover:text-indigo-400'

function FilterChip({ isActive, onClick, children }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={isActive} className={`${base} ${isActive ? active : idle}`}>
      {children}
    </button>
  )
}

export default FilterChip