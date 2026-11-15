import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import PostForm from '../components/PostForm'
import Alert from '../components/ui/Alert'
import Container from '../components/ui/Container'
import PageLoader from '../components/ui/PageLoader'
import { selectUser } from '../features/auth/authSlice'
import { useCategories } from '../hooks/useCategories'
import { createPost } from '../services/postService'
import { getPostErrorMessage } from '../utils/postErrors'
import { useToast } from '../hooks/useToast'
import { getSaveMessage } from '../utils/postRules'

function CreatePost() {
  const user = useSelector(selectUser)
  const navigate = useNavigate()
  const toast = useToast()
  const { categories, isLoading, error: categoriesError } = useCategories()
  const [submitError, setSubmitError] = useState(null)

  async function handleSubmit(values, status, cover) {
    setSubmitError(null)
    try {
      await createPost({ values, status, user, coverFile: cover.file })
      toast.success(getSaveMessage(null, status))
      navigate('/dashboard')
    } catch (error) {
      console.error(error)
      setSubmitError(getPostErrorMessage(error))
    }
  }

  return (
    <Container className="max-w-3xl py-12">
      <h1 className="text-3xl font-bold">Write a post</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Save a private draft, or publish it for everyone to read.
      </p>

      <div className="mt-8">
        {isLoading ? (
          <PageLoader />
        ) : (
          <>
            {categoriesError && (
              <div className="mb-5">
                <Alert>Could not load categories. You can still save a draft.</Alert>
              </div>
            )}
            <PostForm categories={categories} onSubmit={handleSubmit} error={submitError} />
          </>
        )}
      </div>
    </Container>
  )
}

export default CreatePost