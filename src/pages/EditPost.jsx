import { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import PostForm from '../components/PostForm'
import Alert from '../components/ui/Alert'
import Button from '../components/ui/Button'
import Container from '../components/ui/Container'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import PageLoader from '../components/ui/PageLoader'
import { selectUser } from '../features/auth/authSlice'
import { useAsync } from '../hooks/useAsync'
import { useCategories } from '../hooks/useCategories'
import { useToast } from '../hooks/useToast'
import { getOwnPost, updatePost } from '../services/postService'
import { getCoverUrl } from '../services/storageService'
import { getPostErrorMessage } from '../utils/postErrors'
import { getSaveMessage } from '../utils/postRules'

function EditPost() {
  const { postId } = useParams()
  const user = useSelector(selectUser)
  const navigate = useNavigate()
  const toast = useToast()
  const { categories, isLoading: categoriesLoading } = useCategories()
  const [submitError, setSubmitError] = useState(null)

  const fetchPost = useCallback(() => getOwnPost(postId, user.id), [postId, user.id])
  const { data: post, isLoading, error, retry } = useAsync(fetchPost)

  async function handleSubmit(values, status, cover) {
    setSubmitError(null)
    try {
      await updatePost({
        post,
        values,
        status,
        userId: user.id,
        coverFile: cover.file,
        removeCover: cover.remove,
      })
      toast.success(getSaveMessage(post.status, status))
      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      setSubmitError(getPostErrorMessage(err))
    }
  }

  if (isLoading || categoriesLoading) return <PageLoader />

  if (error) {
    return (
      <Container className="py-16">
        <ErrorState title="Couldn't load this post" message={error} onRetry={retry} />
      </Container>
    )
  }

  if (!post) {
    return (
      <Container className="py-16">
        <EmptyState
          title="Post not found"
          description="It may have been deleted, or it isn't yours to edit."
          action={<Button to="/dashboard">Back to my blogs</Button>}
        />
      </Container>
    )
  }

  return (
    <Container className="max-w-3xl py-12">
      <h1 className="text-3xl font-bold">Edit post</h1>
      {post.status === 'published' && (
        <div className="mt-4">
          <Alert tone="info">This post is published. Changes go live as soon as you save.</Alert>
        </div>
      )}

      <div className="mt-8">
        <PostForm
          categories={categories}
          currentStatus={post.status}
          existingCoverUrl={post.coverImageId ? getCoverUrl(post.coverImageId) : null}
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
    </Container>
  )
}

export default EditPost