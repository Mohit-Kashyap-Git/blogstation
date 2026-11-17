import { useCallback } from 'react'
import { getAllPosts } from '../services/adminService'
import { useAsync } from './useAsync'

const EMPTY = []

export function useAdminPosts({ page = 1, pageSize, status = '', search = '' }) {
  const fetchPosts = useCallback(
    () => getAllPosts({ page, pageSize, status, search }),
    [page, pageSize, status, search]
  )
  const { data, isLoading, error, retry } = useAsync(fetchPosts)

  return { posts: data?.posts ?? EMPTY, total: data?.total ?? 0, isLoading, error, retry }
}