import { useEffect, useState } from 'react'
import { getPublishedPostBySlug } from '../services/postService'

export function usePublishedPost(slug) {
  const [result, setResult] = useState({ slug: null, post: null, error: null })

  useEffect(() => {
    let ignore = false

    getPublishedPostBySlug(slug)
      .then((post) => {
        if (!ignore) setResult({ slug, post, error: null })
      })
      .catch((err) => {
        console.error(err)
        if (!ignore) setResult({ slug, post: null, error: 'Could not load this post.' })
      })

    return () => {
      ignore = true
    }
  }, [slug])

  const isLoading = result.slug !== slug

  return {
    post: isLoading ? null : result.post,
    error: isLoading ? null : result.error,
    isLoading,
  }
}