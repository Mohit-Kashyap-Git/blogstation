function Card({ title, description, children }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      {title && <h2 className="text-lg font-semibold">{title}</h2>}
      {description && <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{description}</p>}
      <div className={title ? 'mt-5' : ''}>{children}</div>
    </section>
  )
}

export default Card