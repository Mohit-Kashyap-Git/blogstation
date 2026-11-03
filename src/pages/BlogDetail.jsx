import { Link, useParams } from 'react-router'
import Container from '../components/ui/Container'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'
import { posts, dummyContent } from '../utils/dummyData'
import { formatDate } from '../utils/formatDate'
import { getGradient } from '../utils/getGradient'

function BlogDetail() {
  const { slug } = useParams()
  const post = posts.find((p) => p.slug === slug)

  if (!post) {
    return (
      <Container className="py-16">
        <EmptyState
          title="Post not found"
          description="This post may have been removed or the link is incorrect."
          action={<Button to="/blogs">Browse all blogs</Button>}
        />
      </Container>
    )
  }

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
          <Badge>{post.category}</Badge>
          <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">{post.title}</h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200"
              aria-hidden="true"
            >
              {post.author.charAt(0)}
            </span>
            <div>
              <p className="font-medium text-slate-700 dark:text-slate-200">{post.author}</p>
              <p>
                <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.readTime} min read
              </p>
            </div>
          </div>
        </header>

        {post.coverImage ? (
          <img src={post.coverImage} alt="" className="mt-8 aspect-video w-full rounded-xl object-cover" />
        ) : (
          <div
            className={`mt-8 aspect-video w-full rounded-xl bg-linear-to-br ${getGradient(post.id)}`}
            aria-hidden="true"
          />
        )}

        <div className="mt-8 text-lg leading-8 text-slate-700 dark:text-slate-300">
          <p className="font-medium">{post.excerpt}</p>
          {dummyContent.map((paragraph, index) => (
            <p key={index} className="mt-5">{paragraph}</p>
          ))}
        </div>
      </article>
    </Container>
  )
}

export default BlogDetail