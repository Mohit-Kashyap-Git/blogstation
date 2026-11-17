import { useState } from 'react'
import { useSearchParams } from 'react-router'
import AdminPostItem from '../../components/admin/AdminPostItem'
import Button from '../../components/ui/Button'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import EmptyState from '../../components/ui/EmptyState'
import ErrorState from '../../components/ui/ErrorState'
import FilterChip from '../../components/ui/FilterChip'
import PageLoader from '../../components/ui/PageLoader'
import Pagination from '../../components/ui/Pagination'
import { useAdminPosts } from '../../hooks/useAdminPosts'
import { useCategories } from '../../hooks/useCategories'
import { useSessionExpiry } from '../../hooks/useSessionExpiry'
import { useToast } from '../../hooks/useToast'
import { deletePost } from '../../services/postService'
import { ADMIN_POSTS_PER_PAGE } from '../../utils/constants'
import { getPostErrorMessage } from '../../utils/postErrors'

const STATUS_FILTERS = [
  { value: '', label: 'All' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Drafts' },
]

function AdminPosts() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const rawStatus = searchParams.get('status')
  const status = rawStatus === 'published' || rawStatus === 'draft' ? rawStatus : ''
  const page = Math.max(1, parseInt(searchParams.get('page'), 10) || 1)

  const toast = useToast()
  const handleSessionError = useSessionExpiry()
  const { categories } = useCategories()
  const { posts, total, isLoading, error, retry } = useAdminPosts({
    page,
    pageSize: ADMIN_POSTS_PER_PAGE,
    status,
    search: query.trim(),
  })

  const [busyId, setBusyId] = useState(null)
  const [postToDelete, setPostToDelete] = useState(null)

  const categoryNames = Object.fromEntries(categories.map((c) => [c.slug, c.name]))
  const totalPages = Math.max(1, Math.ceil(total / ADMIN_POSTS_PER_PAGE))

  // Changing the search or filter sends you back to page 1.
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

  async function handleConfirmDelete() {
    const post = postToDelete
    setBusyId(post.$id)
    try {
      await deletePost(post)
      toast.success('Post deleted.')
      retry() // refetch, so the counts and pagination stay correct
    } catch (err) {
      console.error(err)
      if (!(await handleSessionError(err))) toast.error(getPostErrorMessage(err))
    } finally {
      setBusyId(null)
      setPostToDelete(null)
    }
  }

  function renderResults() {
    if (isLoading && posts.length === 0) return <PageLoader />

    if (error) return <ErrorState title="Couldn't load posts" message={error} onRetry={retry} />

    if (posts.length === 0) {
      return page > 1 ? (
        <EmptyState
          title="No posts on this page"
          action={<Button variant="secondary" onClick={() => handlePageChange(1)}>Go to first page</Button>}
        />
      ) : (
        <EmptyState
          title="No posts found"
          description="Try a different search or filter."
          action={<Button variant="secondary" onClick={() => setSearchParams({})}>Clear filters</Button>}
        />
      )
    }

    return (
      <div className={isLoading ? 'opacity-60 transition-opacity' : ''}>
        <ul className="space-y-4">
          {posts.map((post) => (
            <AdminPostItem
              key={post.$id}
              post={post}
              categoryName={categoryNames[post.categorySlug]}
              isBusy={busyId === post.$id}
              onDelete={setPostToDelete}
            />
          ))}
        </ul>
        <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Posts</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">Every post from every author, including drafts.</p>

      <form key={query} onSubmit={handleSearch} role="search" className="mt-6 flex flex-col gap-3 sm:flex-row">
        <label htmlFor="admin-search" className="sr-only">Search posts</label>
        <input
          id="admin-search"
          name="q"
          type="search"
          maxLength={100}
          defaultValue={query}
          placeholder="Search by title or excerpt..."
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm placeholder:text-slate-400 focus-visible:outline-2 focus-visible:outline-indigo-500 dark:border-slate-700 dark:bg-slate-900"
        />
        <Button type="submit">Search</Button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by status">
        {STATUS_FILTERS.map((filter) => (
          <FilterChip
            key={filter.value}
            isActive={status === filter.value}
            onClick={() => updateParams({ status: filter.value })}
          >
            {filter.label}
          </FilterChip>
        ))}
      </div>

      <p className="mt-6 h-5 text-sm text-slate-500 dark:text-slate-400" aria-live="polite">
        {!isLoading && !error && `${total} ${total === 1 ? 'post' : 'posts'} found`}
      </p>

      <div className="mt-4">{renderResults()}</div>

      <ConfirmDialog
        open={postToDelete !== null}
        title="Delete this post?"
        description={`"${postToDelete?.title ?? ''}" by ${postToDelete?.authorName ?? ''} will be permanently deleted. This can't be undone.`}
        confirmLabel="Delete"
        isLoading={postToDelete !== null && busyId === postToDelete.$id}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPostToDelete(null)}
      />
    </div>
  )
}

export default AdminPosts