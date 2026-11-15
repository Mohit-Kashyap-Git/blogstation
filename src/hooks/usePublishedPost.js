import { useCallback } from 'react'
import { getPublishedPostBySlug } from '../services/postService'
import { useAsync } from './useAsync'

export function usePublishedPost(slug) {
  const fetchPost = useCallback(() => getPublishedPostBySlug(slug), [slug])
  const { data, isLoading, error, retry } = useAsync(fetchPost)

  // Never show the previous post while a new one loads. null means "not found".
  return { post: isLoading ? null : data, isLoading, error, retry }
}