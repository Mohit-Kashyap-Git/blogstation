import { Link } from 'react-router'
import Badge from './ui/Badge'
import { formatDate } from '../utils/formatDate'
import { getGradient } from '../utils/getGradient'


function BlogCard({ post }) {
  const { id, slug, title, excerpt, category, author, date, readTime, coverImage } = post

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      {coverImage ? (
        <img src={coverImage} alt="" loading="lazy" className="aspect-video w-full object-cover" />
      ) : (
        <div className={`aspect-video w-full bg-linear-to-br ${getGradient(id)}`} aria-hidden="true" />
      )}

      <div className="flex flex-1 flex-col p-5">
        <Badge className="self-start">{category}</Badge>

        <h3 className="mt-3 text-lg font-semibold leading-snug">
          {/* The ::after stretches the link over the whole card, so the entire card is clickable. */}
          <Link
            to={`/blogs/${slug}`}
            className="after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-indigo-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
          >
            {title}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">{excerpt}</p>

        <div className="mt-auto flex items-center gap-3 pt-4 text-sm text-slate-500 dark:text-slate-400">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200"
            aria-hidden="true"
          >
            {author.charAt(0)}
          </span>
          <div className="min-w-0">
            <p className="truncate font-medium text-slate-700 dark:text-slate-200">{author}</p>
            <p>
              <time dateTime={date}>{formatDate(date)}</time> · {readTime} min read
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}

export default BlogCard