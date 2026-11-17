import { useSelector } from 'react-redux'
import { Outlet } from 'react-router'
import { selectIsAdmin } from '../features/auth/authSlice'
import NotFound from '../pages/NotFound'

// Must be nested inside <ProtectedRoute />, which handles loading and login.
function AdminRoute() {
  const isAdmin = useSelector(selectIsAdmin)

  // Regular users see the same page as for an unknown URL,
  // so the existence of /admin isn't advertised to them.
  return isAdmin ? <Outlet /> : <NotFound />
}

export default AdminRoute