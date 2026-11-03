import { useNavigate } from 'react-router'
import Container from '../ui/Container'
import Button from '../ui/Button'

function Hero() {
  const navigate = useNavigate()

  // Sends the visitor to /blogs?q=... The Blogs page will read it in Phase 4.
  function handleSearch(event) {
    event.preventDefault()
    const query = new FormData(event.currentTarget).get('q').trim()
    navigate(query ? `/blogs?q=${encodeURIComponent(query)}` : '/blogs')
  }

  return (
    <section className="bg-linear-to-b from-indigo-50 to-white dark:from-slate-900 dark:to-slate-950">
      <Container className="py-16 text-center sm:py-24">
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Stories, ideas, and <span className="text-indigo-600 dark:text-indigo-400">expertise</span> worth reading
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
          Read from writers on technology, design, travel, and more, or share your own story with the world.
        </p>

        <form onSubmit={handleSearch} role="search" className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
          <label htmlFor="hero-search" className="sr-only">Search blogs</label>
          <input
            id="hero-search"
            name="q"
            type="search"
            placeholder="Search blogs..."
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm placeholder:text-slate-400 focus-visible:outline-2 focus-visible:outline-indigo-500 dark:border-slate-700 dark:bg-slate-900"
          />
          <Button type="submit" size="lg">Search</Button>
        </form>
      </Container>
    </section>
  )
}

export default Hero