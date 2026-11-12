import { useSearchParams } from 'react-router'
import BlogGrid from '../components/BlogGrid'
import Button from '../components/ui/Button'
import Container from '../components/ui/Container'
import EmptyState from '../components/ui/EmptyState'
import PageLoader from '../components/ui/PageLoader'
import Pagination from '../components/ui/Pagination'
import { useCategories } from '../hooks/useCategories'
import { usePublishedPosts } from '../hooks/usePublishedPosts'
import { POSTS_PER_PAGE } from '../utils/constants'
import { toCardData } from '../utils/postMapper'

const chipBase =
  'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-indigo-500'
const chipActive = 'border-indigo-600 bg-indigo-600 text-white'
const chipIdle =
  'border-slate-300 hover:border-indigo-500 hover:text-indigo-600 dark:border-slate-700 dark:hover:border-indigo-400 dark:hover:text-indigo-400'

function Blogs() {
  // The URL is the source of truth, so filtered pages can be shared and bookmarked.
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const categorySlug = searchParams.get('category') ?? ''
  const page = Math.max(1, parseInt(searchParams.get('page'), 10) || 1)

  const { categories } = useCategories()
  const { posts, total, isLoading, error, retry } = usePublishedPosts({
    page,
    pageSize: POSTS_PER_PAGE,
    categorySlug,
    search: query.trim(),
  })

  const categoryNames = Object.fromEntries(categories.map((c) => [c.slug, c.name]))
  const totalPages = Math.max(1, Math.ceil(total / POSTS_PER_PAGE))

  // Sets or removes URL params while keeping the others.
  // Changing the search or category sends you back to page 1.
  function updateParams(changes) {
    const next = new URLSearchParams(searchParams)
    if (!('page' in changes)) next.delete('page')
    Object.entries(changes).forEach(([key, value]) => {
      if (value) next.set(key, value)
      else next.delete(key)
    })
    setSearchParams(next)
  }

  function handleSearch(event) {
    event.preventDefault()
    updateParams({ q: new FormData(event.currentTarget).get('q').trim() })
  }

  function handlePageChange(newPage) {
    updateParams({ page: newPage > 1 ? String(newPage) : '' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function renderResults() {
    // First load, or a filter change that previously had no results.
    if (isLoading && posts.length === 0) return <PageLoader />

    if (error) {
      return (
        <EmptyState
          title="Couldn't load posts"
          description={error}
          action={<Button variant="secondary" onClick={retry}>Try again</Button>}
        />
      )
    }

    if (posts.length === 0) {
      return page > 1 ? (
        <EmptyState
          title="No posts on this page"
          action={<Button variant="secondary" onClick={() => handlePageChange(1)}>Go to first page</Button>}
        />
      ) : (
        <EmptyState
          title="No posts found"
          description="Try a different search term or choose another category."
          action={<Button variant="secondary" onClick={() => setSearchParams({})}>Clear filters</Button>}
        />
      )
    }

    return (
      // Previous results stay visible (dimmed) while the next page loads.
      <div className={isLoading ? 'opacity-60 transition-opacity' : ''}>
        <BlogGrid posts={posts.map((post) => toCardData(post, categoryNames))} />
        <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    )
  }

  return (
    <Container className="py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold sm:text-4xl">All blogs</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Search and explore posts from our writers.</p>
      </header>

      {/* key={query} resets the input when the URL changes (e.g. "Clear filters") */}
      <form key={query} onSubmit={handleSearch} role="search" className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="blogs-search" className="sr-only">Search blogs</label>
        <input
          id="blogs-search"
          name="q"
          type="search"
          maxLength={100}
          defaultValue={query}
          placeholder="Search blogs..."
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm placeholder:text-slate-400 focus-visible:outline-2 focus-visible:outline-indigo-500 dark:border-slate-700 dark:bg-slate-900"
        />
        <Button type="submit">Search</Button>
      </form>

      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        <button
          type="button"
          onClick={() => updateParams({ category: '' })}
          aria-pressed={!categorySlug}
          className={`${chipBase} ${!categorySlug ? chipActive : chipIdle}`}
        >
          All
        </button>
        {categories.map((category) => {
          const isActive = category.slug === categorySlug
          return (
            <button
              key={category.slug}
              type="button"
              onClick={() => updateParams({ category: category.slug })}
              aria-pressed={isActive}
              className={`${chipBase} ${isActive ? chipActive : chipIdle}`}
            >
              {category.name}
            </button>
          )
        })}
      </div>

      <p className="mt-8 h-5 text-sm text-slate-500 dark:text-slate-400" aria-live="polite">
        {!isLoading && !error && `${total} ${total === 1 ? 'post' : 'posts'} found`}
      </p>

      <div className="mt-4">{renderResults()}</div>
    </Container>
  )
}

export default Blogs