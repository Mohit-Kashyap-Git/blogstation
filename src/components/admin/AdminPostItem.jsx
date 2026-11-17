import Button from '../ui/Button'
import StatusBadge from '../ui/StatusBadge'
import { formatDate } from '../../utils/formatDate'

function AdminPostItem({ post, categoryName, isBusy, onDelete }) {
  const isPublished = post.status === 'published'

  return (
    <li className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={post.status} />
            {categoryName && <span className="text-xs text-slate-500 dark:text-slate-400">{categoryName}</span>}
          </div>
          <h2 className="mt-2 truncate text-lg font-semibold">{post.title}</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            By {post.authorName} · Updated <time dateTime={post.$updatedAt}>{formatDate(post.$updatedAt)}</time>
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button to={`/admin/posts/${post.$id}/edit`} variant="secondary" size="sm">Edit</Button>
          {isPublished && <Button to={`/blogs/${post.slug}`} variant="ghost" size="sm">View</Button>}
          <Button variant="dangerGhost" size="sm" disabled={isBusy} onClick={() => onDelete(post)}>
            Delete
          </Button>
        </div>
      </div>
    </li>
  )
}

export default AdminPostItem