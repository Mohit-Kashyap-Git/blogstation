import { useCallback } from 'react'
import { getMyPostCounts } from '../services/postService'
import { useAsync } from './useAsync'

export function useMyPostCounts(userId) {
  const fetchCounts = useCallback(() => getMyPostCounts(userId), [userId])
  const { data, isLoading, error } = useAsync(fetchCounts)

  return { counts: isLoading ? null : data, isLoading, error }
}