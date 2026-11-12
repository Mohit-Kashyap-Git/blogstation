import Button from './Button'

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-4">
      <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        Previous
      </Button>
      <span className="text-sm text-slate-600 dark:text-slate-400">
        Page {page} of {totalPages}
      </span>
      <Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
        Next
      </Button>
    </nav>
  )
}

export default Pagination