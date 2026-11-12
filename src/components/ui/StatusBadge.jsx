const styles = {
  published: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
  draft: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
}

function StatusBadge({ status }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}>
      {status === 'published' ? 'Published' : 'Draft'}
    </span>
  )
}

export default StatusBadge