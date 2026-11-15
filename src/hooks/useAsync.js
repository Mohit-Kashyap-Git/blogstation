import { useCallback, useEffect, useState } from 'react'
import { getErrorMessage } from '../utils/appwriteErrors'
import { useSessionExpiry } from './useSessionExpiry'

const INITIAL = { fetcher: null, attempt: -1, data: null, error: null }

// Runs `fetcher` (a function that returns a promise) whenever it changes.
//
// IMPORTANT: `fetcher` must be a stable function. Define it outside the component,
// or wrap it in useCallback with the values it depends on. Its identity is how
// this hook knows the inputs changed (and a new function every render would
// cause an endless loop of requests).
//
// Returns { data, error, isLoading, retry, mutate }:
// - `data` keeps the last result while a new request loads (handy for pagination).
//   If you don't want stale data on screen, check isLoading first.
// - `error` is a user-friendly message string, or null.
// - `mutate(updater)` updates `data` locally, e.g. after deleting an item.
export function useAsync(fetcher) {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState(INITIAL)
  const handleSessionError = useSessionExpiry()

  useEffect(() => {
    let ignore = false // set to true if the inputs change or the component unmounts

    fetcher()
      .then((data) => {
        if (!ignore) setResult({ fetcher, attempt, data, error: null })
      })
      .catch(async (error) => {
        console.error(error)
        if (ignore) return
        // If the session ended, this logs the user out and the route guard redirects.
        await handleSessionError(error)
        if (!ignore) setResult({ fetcher, attempt, data: null, error })
      })

    return () => {
      ignore = true
    }
  }, [fetcher, attempt, handleSessionError])

  const retry = useCallback(() => setAttempt((count) => count + 1), [])
  const mutate = useCallback(
    (updater) => setResult((current) => ({ ...current, data: updater(current.data) })),
    []
  )

  // The stored result belongs to an older request, so we're still loading.
  const isLoading = result.fetcher !== fetcher || result.attempt !== attempt

  return {
    data: result.data,
    error: !isLoading && result.error ? getErrorMessage(result.error) : null,
    isLoading,
    retry,
    mutate,
  }
}