import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import { logoutUser } from '../features/auth/authSlice'

export function useLogout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  return async function logout() {
    const result = await dispatch(logoutUser())
    // Always land on the homepage, even if the user was on a protected page.
    if (logoutUser.fulfilled.match(result)) navigate('/', { replace: true })
  }
}