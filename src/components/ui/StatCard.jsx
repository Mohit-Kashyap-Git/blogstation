import { Link } from 'react-router'

const base = 'rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900'

// Pass `to` to make the whole card a link.
function StatCard({ label, value, to }) {
  const content = (
    <>
      <p className="text-3xl font-bold">{value}</p>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{label}</p>
    </>
  )

  if (!to) return <div className={base}>{content}</div>

  return (
    <Link
      to={to}
      className={`${base} block transition-colors hover:border-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-500 dark:hover:border-indigo-400`}
    >
      {content}
    </Link>
  )
}

export default StatCard