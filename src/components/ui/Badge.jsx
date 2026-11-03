function Badge({ className = '', ...props }) {
  return (
    <span
      className={`inline-block rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300 ${className}`}
      {...props}
    />
  )
}

export default Badge