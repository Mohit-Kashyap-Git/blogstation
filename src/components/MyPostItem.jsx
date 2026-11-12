import { Link } from 'react-router'
import Button from './ui/Button'
import StatusBadge from './ui/StatusBadge'
import { formatDate } from '../utils/formatDate'
import { getMissingForPublish } from '../utils/postRules'

function MyPostItem({ post, categoryName, isBusy, onToggleStatus, onDelete }) {
  const isPublished = post.status === 'published'
  const missing = getMissingForPublish(post)
  const canPublish = isPublished || missing.length === 0
  const editPath = `/posts/${post.$id}/edit`

  return (
    <li className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={post.status} />
            {categoryName && <span className="text-xs text-slate-500 dark:text-slate-400">{categoryName}</span>}
          </div>

          <h2 className="mt-2 truncate text-lg font-semibold">
            <Link
              to={editPath}
              className="hover:text-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500 dark:hover:text-indigo-400"
            >
              {post.title}
            </Link>
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Updated <time dateTime={post.$updatedAt}>{formatDate(post.$updatedAt)}</time>
          </p>

          {!canPublish && (
            <p className="mt-2 text-xs text-amber-700 dark:text-amber-400">
              To publish, add {missing.join(', ')}.
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button to={editPath} variant="secondary" size="sm">Edit</Button>
          {isPublished && (
            <Button to={`/blogs/${post.slug}`} variant="ghost" size="sm">View</Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            disabled={isBusy || !canPublish}
            onClick={() => onToggleStatus(post)}
          >
            {isPublished ? 'Unpublish' : 'Publish'}
          </Button>
          <Button variant="dangerGhost" size="sm" disabled={isBusy} onClick={() => onDelete(post)}>
            Delete
          </Button>
        </div>
      </div>
    </li>
  )
}

export default MyPostItem