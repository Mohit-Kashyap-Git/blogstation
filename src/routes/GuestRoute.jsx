import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router'
import PageLoader from '../components/ui/PageLoader'
import { selectIsAuthenticated, selectIsInitializing } from '../features/auth/authSlice'

// Wrap routes only for logged-out users (login, register).
function GuestRoute() {
  const location = useLocation()
  const isInitializing = useSelector(selectIsInitializing)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  if (isInitializing) return <PageLoader />

  if (isAuthenticated) {
    // Go back to the page the user originally wanted, or home.
    const from = location.state?.from
    const destination = from ? `${from.pathname}${from.search}` : '/'
    return <Navigate to={destination} replace />
  }

  return <Outlet />
}

export default GuestRoute