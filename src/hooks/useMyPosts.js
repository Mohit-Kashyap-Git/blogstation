import { useCallback } from 'react'
import { getMyPosts } from '../services/postService'
import { useAsync } from './useAsync'

const EMPTY = []

export function useMyPosts(userId) {
  const fetchPosts = useCallback(() => getMyPosts(userId), [userId])
  const { data, isLoading, error, retry, mutate } = useAsync(fetchPosts)

  return {
    posts: data ?? EMPTY,
    // Lets the page update the list locally after publish/delete, with no refetch.
    setPosts: (updater) => mutate((current) => updater(current ?? EMPTY)),
    isLoading,
    error,
    reload: retry,
  }
}