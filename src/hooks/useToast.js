import { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { addToast } from '../features/toast/toastSlice'

// Usage: const toast = useToast(); toast.success('Saved.')
export function useToast() {
  const dispatch = useDispatch()

  // useMemo keeps the object's identity stable, so it's safe in effect dependencies.
  return useMemo(
    () => ({
      success: (message) => dispatch(addToast('success', message)),
      error: (message) => dispatch(addToast('error', message)),
      info: (message) => dispatch(addToast('info', message)),
    }),
    [dispatch]
  )
}