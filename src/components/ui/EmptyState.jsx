// `action` is optional: pass a Button to give the user a way forward.
function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 px-6 py-16 text-center dark:border-slate-700">
      <h2 className="text-lg font-semibold">{title}</h2>
      {description && <p className="mx-auto mt-2 max-w-md text-slate-600 dark:text-slate-400">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

export default EmptyState