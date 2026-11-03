import { Link } from 'react-router'
import Hero from '../components/home/Hero'
import CallToAction from '../components/home/CallToAction'
import BlogGrid from '../components/BlogGrid'
import Container from '../components/ui/Container'
import Button from '../components/ui/Button'
import SectionHeading from '../components/ui/SectionHeading'
import { categories, posts } from '../utils/dummyData'

function Home() {
  const latestPosts = posts.slice(0, 6)

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
          <BlogGrid posts={latestPosts} />
        </Container>
      </section>

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

      <CallToAction />
    </>
  )
}

export default Home