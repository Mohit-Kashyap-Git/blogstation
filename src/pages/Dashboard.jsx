import { useState } from 'react'
import { useSelector } from 'react-redux'
import MyPostItem from '../components/MyPostItem'
import Button from '../components/ui/Button'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Container from '../components/ui/Container'
import EmptyState from '../components/ui/EmptyState'
import PageLoader from '../components/ui/PageLoader'
import { selectUser } from '../features/auth/authSlice'
import { useCategories } from '../hooks/useCategories'
import { useMyPosts } from '../hooks/useMyPosts'
import { deletePost, setPostStatus } from '../services/postService'
import { getPostErrorMessage } from '../utils/postErrors'
import { useToast } from '../hooks/useToast'
import { getSaveMessage } from '../utils/postRules'

function Dashboard() {
  const user = useSelector(selectUser)
  const { posts, setPosts, isLoading, error, reload } = useMyPosts(user.id)
  const { categories } = useCategories()
  const toast = useToast()
  const [busyId, setBusyId] = useState(null) // the post currently being changed
  const [postToDelete, setPostToDelete] = useState(null)

  const categoryNames = Object.fromEntries(categories.map((c) => [c.slug, c.name]))

  async function handleToggleStatus(post) {
    setBusyId(post.$id)
    try {
      const status = post.status === 'published' ? 'draft' : 'published'
      const updated = await setPostStatus({ post, status, userId: user.id })
      setPosts((list) => list.map((item) => (item.$id === updated.$id ? updated : item)))
      toast.success(getSaveMessage(post.status, status))
    } catch (err) {
      console.error(err)
      toast.error(getPostErrorMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  async function handleConfirmDelete() {
    const post = postToDelete
    setBusyId(post.$id)
    try {
      await deletePost(post)
      setPosts((list) => list.filter((item) => item.$id !== post.$id))
      toast.success('Post deleted.')
    } catch (err) {
      console.error(err)
      toast.error(getPostErrorMessage(err))
    } finally {
      setBusyId(null)
      setPostToDelete(null)
    }
  }

  return (
    <Container className="max-w-4xl py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My blogs</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Welcome, {user.name}. Manage your drafts and published posts.</p>
        </div>
        <Button to="/posts/new">Write a post</Button>
      </div>

      <div className="mt-8">

        {isLoading ? (
          <PageLoader />
        ) : error ? (
          <EmptyState
            title="Couldn't load your posts"
            description={error}
            action={<Button variant="secondary" onClick={reload}>Try again</Button>}
          />
        ) : posts.length === 0 ? (
          <EmptyState
            title="You haven't written anything yet"
            description="Start with a draft. Nobody else can see it until you publish."
            action={<Button to="/posts/new">Write your first post</Button>}
          />
        ) : (
          <ul className="space-y-4">
            {posts.map((post) => (
              <MyPostItem
                key={post.$id}
                post={post}
                categoryName={categoryNames[post.categorySlug]}
                isBusy={busyId === post.$id}
                onToggleStatus={handleToggleStatus}
                onDelete={setPostToDelete}
              />
            ))}
          </ul>
        )}
      </div>

      <ConfirmDialog
        open={postToDelete !== null}
        title="Delete this post?"
        description={`"${postToDelete?.title ?? ''}" will be permanently deleted. This can't be undone.`}
        confirmLabel="Delete"
        isLoading={postToDelete !== null && busyId === postToDelete.$id}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPostToDelete(null)}
      />
    </Container>
  )
}

export default Dashboard