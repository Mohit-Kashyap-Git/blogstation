import { useCallback, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import PostForm from '../../components/PostForm'
import Alert from '../../components/ui/Alert'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import ErrorState from '../../components/ui/ErrorState'
import PageLoader from '../../components/ui/PageLoader'
import { useAsync } from '../../hooks/useAsync'
import { useCategories } from '../../hooks/useCategories'
import { useToast } from '../../hooks/useToast'
import { getPostForAdmin } from '../../services/adminService'
import { updatePost } from '../../services/postService'
import { getPostErrorMessage } from '../../utils/postErrors'

function AdminEditPost() {
  const { postId } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { categories, isLoading: categoriesLoading } = useCategories()
  const [submitError, setSubmitError] = useState(null)

  const fetchPost = useCallback(() => getPostForAdmin(postId), [postId])
  const { data: post, isLoading, error, retry } = useAsync(fetchPost)

  // In moderator mode `status` is always the post's current status.
  async function handleSubmit(values, status) {
    setSubmitError(null)
    try {
      await updatePost({ post, values, status, userId: post.authorId, keepPermissions: true })
      toast.success('Changes saved.')
      navigate('/admin/posts')
    } catch (err) {
      console.error(err)
      setSubmitError(getPostErrorMessage(err))
    }
  }

  if (isLoading || categoriesLoading) return <PageLoader />

  if (error) return <ErrorState title="Couldn't load this post" message={error} onRetry={retry} />

  if (!post) {
    return (
      <EmptyState
        title="Post not found"
        description="It may have been deleted."
        action={<Button to="/admin/posts">Back to posts</Button>}
      />
    )
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold">Edit post</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        By {post.authorName}. You are editing as an admin.
      </p>
      <div className="mt-4">
        <Alert tone="info">
          Status and cover image aren't changed here.{' '}
          {post.status === 'published'
            ? 'This post is live, so changes go public as soon as you save.'
            : "This is a draft, so it stays private to its author."}
        </Alert>
      </div>

      <div className="mt-8">
        <PostForm
          mode="moderator"
          categories={categories}
          currentStatus={post.status}
          defaultValues={{
            title: post.title,
            categorySlug: post.categorySlug ?? '',
            excerpt: post.excerpt ?? '',
            content: post.content ?? '',
          }}
          onSubmit={handleSubmit}
          error={submitError}
        />
      </div>
    </div>
  )
}

export default AdminEditPost