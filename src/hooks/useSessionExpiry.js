import { useCallback } from 'react'
import { useDispatch, useStore } from 'react-redux'
import { sessionExpired } from '../features/auth/authSlice'
import { isSessionActive } from '../services/authService'
import { useToast } from './useToast'

// Returns handleSessionError(error) -> Promise<boolean>.
// true  = the session had ended; we logged the user out locally and told them,
//         so the caller should NOT show its own error.
// false = not a session problem; the caller should show its normal error.
export function useSessionExpiry() {
  const dispatch = useDispatch()
  const store = useStore() // read the latest state without re-rendering or changing identity
  const toast = useToast()

  return useCallback(
    async (error) => {
      if (error?.code !== 401) return false
      if (!store.getState().auth.user) return false // guests have no session to lose

      // 401 can also mean "no permission", so confirm with Appwrite first.
      if (await isSessionActive()) return false

      // Several requests can fail together. Only the first one should react.
      if (!store.getState().auth.user) return true

      dispatch(sessionExpired())
      toast.info('Your session has expired. Please log in again.')
      return true
    },
    [dispatch, store, toast]
  )
}