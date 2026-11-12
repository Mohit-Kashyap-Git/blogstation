import { useEffect, useState } from 'react'
import { getPublishedPosts } from '../services/postService'

export function usePublishedPosts({ page = 1, pageSize, categorySlug = '', search = '' }) {
  const [attempt, setAttempt] = useState(0) // bumped by retry()
  const requestKey = `${page}|${pageSize}|${categorySlug}|${search}|${attempt}`
  const [result, setResult] = useState({ key: null, posts: [], total: 0, error: null })

  useEffect(() => {
    let ignore = false

    getPublishedPosts({ page, pageSize, categorySlug, search })
      .then(({ posts, total }) => {
        if (!ignore) setResult({ key: requestKey, posts, total, error: null })
      })
      .catch((err) => {
        console.error(err)
        if (!ignore) setResult({ key: requestKey, posts: [], total: 0, error: 'Could not load posts.' })
      })

    return () => {
      ignore = true
    }
  }, [requestKey, page, pageSize, categorySlug, search])

  // "Loading" means the stored result belongs to an older request.
  // The previous posts stay visible meanwhile, so the page doesn't flash empty.
  const isLoading = result.key !== requestKey

  return {
    posts: result.posts,
    total: result.total,
    error: isLoading ? null : result.error,
    isLoading,
    retry: () => setAttempt((count) => count + 1),
  }
}