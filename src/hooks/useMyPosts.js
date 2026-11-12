import { useCallback, useEffect, useState } from 'react'
import { getMyPosts } from '../services/postService'

export function useMyPosts(userId) {
  const [state, setState] = useState({ posts: [], isLoading: true, error: null })
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let ignore = false

    getMyPosts(userId)
      .then((posts) => {
        if (!ignore) setState({ posts, isLoading: false, error: null })
      })
      .catch((error) => {
        console.error(error)
        if (!ignore) setState({ posts: [], isLoading: false, error: 'Could not load your posts.' })
      })

    return () => {
      ignore = true
    }
  }, [userId, reloadKey])

  // Lets the page update one row locally after publish/delete, with no refetch.
  const setPosts = useCallback((updater) => {
    setState((current) => ({ ...current, posts: updater(current.posts) }))
  }, [])

  const reload = useCallback(() => {
    setState((current) => ({ ...current, isLoading: true, error: null }))
    setReloadKey((key) => key + 1)
  }, [])

  return { ...state, setPosts, reload }
}