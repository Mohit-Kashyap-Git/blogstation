// role="alert" makes screen readers announce the message when it appears.
function Alert({ children }) {
  return (
    <div
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
    >
      {children}
    </div>
  )
}

export default Alert