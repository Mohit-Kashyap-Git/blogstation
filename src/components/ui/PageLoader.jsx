function PageLoader() {
  return (
    <div role="status" className="flex min-h-[50vh] items-center justify-center">
      <div
        className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-400"
        aria-hidden="true"
      />
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export default PageLoader