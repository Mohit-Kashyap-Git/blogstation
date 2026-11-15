import { useCallback } from 'react'
import { getPublishedPosts } from '../services/postService'
import { useAsync } from './useAsync'

const EMPTY = []

export function usePublishedPosts({ page = 1, pageSize, categorySlug = '', search = '' }) {
  const fetchPosts = useCallback(
    () => getPublishedPosts({ page, pageSize, categorySlug, search }),
    [page, pageSize, categorySlug, search]
  )
  const { data, isLoading, error, retry } = useAsync(fetchPosts)

  return {
    posts: data?.posts ?? EMPTY,
    total: data?.total ?? 0,
    isLoading,
    error,
    retry,
  }
}