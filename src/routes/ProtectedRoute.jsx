import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router'
import PageLoader from '../components/ui/PageLoader'
import { selectIsAuthenticated, selectIsInitializing } from '../features/auth/authSlice'

// Wrap routes that need a logged-in user. Renders the child route via <Outlet />.
function ProtectedRoute() {
  const location = useLocation()
  const isInitializing = useSelector(selectIsInitializing)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  // Wait for the session check. Otherwise a logged-in user who refreshes
  // would be sent to /login for a split second.
  if (isInitializing) return <PageLoader />

  if (!isAuthenticated) {
    // Remember where the user was going so login can send them back.
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

export default ProtectedRoute