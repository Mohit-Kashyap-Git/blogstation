import { useEffect, useState } from 'react'
import { getCategories } from '../services/categoryService'

export function useCategories() {
  const [state, setState] = useState({ categories: [], isLoading: true, error: null })

  useEffect(() => {
    let ignore = false // prevents updating state after the component unmounts

    getCategories()
      .then((categories) => {
        if (!ignore) setState({ categories, isLoading: false, error: null })
      })
      .catch((error) => {
        console.error(error)
        if (!ignore) setState({ categories: [], isLoading: false, error: 'Could not load categories.' })
      })

    return () => {
      ignore = true
    }
  }, [])

  return state
}