import { useSearchParams } from 'react-router'
import Container from '../components/ui/Container'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import BlogGrid from '../components/BlogGrid'
import { categories, posts } from '../utils/dummyData'

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

  const activeCategory = categories.find((c) => c.slug === categorySlug)
  const term = query.trim().toLowerCase()

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = !activeCategory || post.category === activeCategory.name
    const matchesQuery =
      !term || post.title.toLowerCase().includes(term) || post.excerpt.toLowerCase().includes(term)
    return matchesCategory && matchesQuery
  })

  // Sets or removes URL params while keeping the others.
  function updateParams(changes) {
    const next = new URLSearchParams(searchParams)
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
          aria-pressed={!activeCategory}
          className={`${chipBase} ${!activeCategory ? chipActive : chipIdle}`}
        >
          All
        </button>
        {categories.map((category) => {
          const isActive = category.slug === activeCategory?.slug
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

      <p className="mt-8 text-sm text-slate-500 dark:text-slate-400" aria-live="polite">
        {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} found
      </p>

      <div className="mt-4">
        {filteredPosts.length > 0 ? (
          <BlogGrid posts={filteredPosts} />
        ) : (
          <EmptyState
            title="No posts found"
            description="Try a different search term or choose another category."
            action={
              <Button variant="secondary" onClick={() => setSearchParams({})}>
                Clear filters
              </Button>
            }
          />
        )}
      </div>
    </Container>
  )
}

export default Blogs