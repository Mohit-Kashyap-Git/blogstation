import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import { logoutUser } from '../features/auth/authSlice'
import { useToast } from './useToast'

export function useLogout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const toast = useToast()

  return async function logout() {
    try {
      await dispatch(logoutUser()).unwrap()
      // Always land on the homepage, even if the user was on a protected page.
      navigate('/', { replace: true })
      toast.success('You have been logged out.')
    } catch (message) {
      toast.error(message)
    }
  }
}