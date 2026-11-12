import { Link } from 'react-router'
import BlogGrid from '../components/BlogGrid'
import CallToAction from '../components/home/CallToAction'
import Hero from '../components/home/Hero'
import Button from '../components/ui/Button'
import Container from '../components/ui/Container'
import EmptyState from '../components/ui/EmptyState'
import PageLoader from '../components/ui/PageLoader'
import SectionHeading from '../components/ui/SectionHeading'
import { useCategories } from '../hooks/useCategories'
import { usePublishedPosts } from '../hooks/usePublishedPosts'
import { toCardData } from '../utils/postMapper'

function Home() {
  const { categories } = useCategories()
  const { posts, isLoading, error, retry } = usePublishedPosts({ page: 1, pageSize: 6 })

  const categoryNames = Object.fromEntries(categories.map((c) => [c.slug, c.name]))

  function renderLatest() {
    if (isLoading) return <PageLoader />

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
      return (
        <EmptyState
          title="No posts yet"
          description="Be the first to publish a story."
          action={<Button to="/posts/new">Write a post</Button>}
        />
      )
    }

    return <BlogGrid posts={posts.map((post) => toCardData(post, categoryNames))} />
  }

  return (
    <>
      <Hero />

      <section className="py-16">
        <Container>
          <SectionHeading
            title="Latest posts"
            subtitle="Fresh reads from our community of writers."
            action={<Button to="/blogs" variant="secondary" size="sm">View all</Button>}
          />
          {renderLatest()}
        </Container>
      </section>

      {categories.length > 0 && (
        <section className="bg-slate-50 py-16 dark:bg-slate-900">
          <Container>
            <SectionHeading title="Browse by category" subtitle="Find topics you care about." />
            <ul className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    to={`/blogs?category=${category.slug}`}
                    className="inline-block rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium transition-colors hover:border-indigo-500 hover:text-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-indigo-400 dark:hover:text-indigo-400"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <CallToAction />
    </>
  )
}

export default Home