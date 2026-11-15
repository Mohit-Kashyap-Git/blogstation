import { getCategories } from '../services/categoryService'
import { useAsync } from './useAsync'

const EMPTY = []

export function useCategories() {
  // getCategories is a module-level function, so its identity is already stable.
  const { data, isLoading, error } = useAsync(getCategories)
  return { categories: data ?? EMPTY, isLoading, error }
}