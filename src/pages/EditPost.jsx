import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import PostForm from '../components/PostForm'
import Alert from '../components/ui/Alert'
import Button from '../components/ui/Button'
import Container from '../components/ui/Container'
import EmptyState from '../components/ui/EmptyState'
import PageLoader from '../components/ui/PageLoader'
import { selectUser } from '../features/auth/authSlice'
import { useCategories } from '../hooks/useCategories'
import { getPostById, updatePost } from '../services/postService'
import { getPostErrorMessage } from '../utils/postErrors'
import { getCoverUrl } from '../services/storageService'
import { useToast } from '../hooks/useToast'
import { getSaveMessage } from '../utils/postRules'

function EditPost() {
  const { postId } = useParams()
  const user = useSelector(selectUser)
  const navigate = useNavigate()
  const toast = useToast()
  const { categories, isLoading: categoriesLoading } = useCategories()

  const [state, setState] = useState({ post: null, isLoading: true, notFound: false, error: null })
  const [submitError, setSubmitError] = useState(null)

  useEffect(() => {
    let ignore = false

    getPostById(postId)
      .then((post) => {
        if (ignore) return
        // Published posts are readable by everyone, so check ownership here too.
        // (Appwrite still blocks the actual update for non-owners.)
        if (post.authorId !== user.id) setState({ post: null, isLoading: false, notFound: true, error: null })
        else setState({ post, isLoading: false, notFound: false, error: null })
      })
      .catch((err) => {
        if (ignore) return
        // Someone else's draft returns 401/404. Treat both as "not found".
        if (err.code === 404 || err.code === 401) {
          setState({ post: null, isLoading: false, notFound: true, error: null })
        } else {
          console.error(err)
          setState({ post: null, isLoading: false, notFound: false, error: 'Could not load this post.' })
        }
      })

    return () => {
      ignore = true
    }
  }, [postId, user.id])

  async function handleSubmit(values, status, cover) {
    setSubmitError(null)
    try {
      await updatePost({
        post: state.post,
        values,
        status,
        userId: user.id,
        coverFile: cover.file,
        removeCover: cover.remove,
      })
      toast.success(getSaveMessage(state.post.status, status))
      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      setSubmitError(getPostErrorMessage(err))
    }
  }

  const { post, isLoading, notFound, error } = state

  if (isLoading || categoriesLoading) return <PageLoader />

  if (notFound || error) {
    return (
      <Container className="py-16">
        <EmptyState
          title={notFound ? 'Post not found' : "Couldn't load this post"}
          description={notFound ? "It may have been deleted, or it isn't yours to edit." : error}
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
          defaultValues={{
            title: post.title,
            categorySlug: post.categorySlug ?? '',
            excerpt: post.excerpt ?? '',
            content: post.content ?? '',
          }}
          existingCoverUrl={post.coverImageId ? getCoverUrl(post.coverImageId) : null}
          onSubmit={handleSubmit}
          error={submitError}
        />
      </div>
    </Container>
  )
}

export default EditPost