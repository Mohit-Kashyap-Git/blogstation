import { Link, useParams } from 'react-router'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Container from '../components/ui/Container'
import EmptyState from '../components/ui/EmptyState'
import PageLoader from '../components/ui/PageLoader'
import { useCategories } from '../hooks/useCategories'
import { usePublishedPost } from '../hooks/usePublishedPost'
import { formatDate } from '../utils/formatDate'
import { getGradient } from '../utils/getGradient'
import { estimateReadTime } from '../utils/readTime'
import { getCoverUrl } from '../services/storageService'

function BlogDetail() {
  const { slug } = useParams()
  const { post, isLoading, error } = usePublishedPost(slug)
  const { categories } = useCategories()

  if (isLoading) return <PageLoader />

  if (error || !post) {
    return (
      <Container className="py-16">
        <EmptyState
          title={error ? "Couldn't load this post" : 'Post not found'}
          description={error ?? 'This post may have been removed or the link is incorrect.'}
          action={<Button to="/blogs">Browse all blogs</Button>}
        />
      </Container>
    )
  }

  const categoryName = categories.find((c) => c.slug === post.categorySlug)?.name
  const content = post.content ?? ''
  // Blank lines separate paragraphs. React escapes the text, so user content can't inject HTML.
  const paragraphs = content.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)

  return (
    <Container className="max-w-3xl py-12">
      <Link
        to="/blogs"
        className="text-sm font-medium text-indigo-600 hover:underline focus-visible:outline-2 focus-visible:outline-indigo-500 dark:text-indigo-400"
      >
        ← Back to all blogs
      </Link>

      <article className="mt-6">
        <header>
          {categoryName && <Badge>{categoryName}</Badge>}
          <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">{post.title}</h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200"
              aria-hidden="true"
            >
              {post.authorName.charAt(0).toUpperCase()}
            </span>
            <div>
              <p className="font-medium text-slate-700 dark:text-slate-200">{post.authorName}</p>
              <p>
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time> · {estimateReadTime(content)} min read
              </p>
            </div>
          </div>
        </header>

        {post.coverImageId ? (
          <img
            src={getCoverUrl(post.coverImageId)}
            alt=""
            className="mt-8 aspect-video w-full rounded-xl object-cover"
          />
        ) : (
          <div
            className={`mt-8 aspect-video w-full rounded-xl bg-linear-to-br ${getGradient(post.$id)}`}
            aria-hidden="true"
          />
        )}

        <div className="mt-8 text-lg leading-8 text-slate-700 dark:text-slate-300">
          {post.excerpt && <p className="font-medium">{post.excerpt}</p>}
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="mt-5 whitespace-pre-line">{paragraph}</p>
          ))}
        </div>
      </article>
    </Container>
  )
}

export default BlogDetail