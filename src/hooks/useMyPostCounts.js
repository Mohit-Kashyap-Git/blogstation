import { useEffect, useState } from 'react'
import { getMyPostCounts } from '../services/postService'

export function useMyPostCounts(userId) {
  const [result, setResult] = useState({ userId: null, counts: null, error: false })

  useEffect(() => {
    let ignore = false

    getMyPostCounts(userId)
      .then((counts) => {
        if (!ignore) setResult({ userId, counts, error: false })
      })
      .catch((err) => {
        console.error(err)
        if (!ignore) setResult({ userId, counts: null, error: true })
      })

    return () => {
      ignore = true
    }
  }, [userId])

  return {
    counts: result.userId === userId ? result.counts : null,
    isLoading: result.userId !== userId,
    error: result.userId === userId && result.error,
  }
}