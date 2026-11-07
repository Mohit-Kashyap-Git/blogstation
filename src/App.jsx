import { useEffect } from 'react'
import AppRoutes from './routes/AppRoutes'
import { selectTheme, STORAGE_KEY } from './features/theme/themeSlice'
import { useDispatch, useSelector } from 'react-redux'
import { initializeAuth } from './features/auth/authSlice'

function App() {
  const theme = useSelector(selectTheme)
  const dispatch = useDispatch()

  // Ask Appwrite once on load: is there a valid session cookie?
  useEffect(() => {
    dispatch(initializeAuth())
  }, [dispatch])

  // Keep the <html> class and localStorage in sync with the Redux theme.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // Ignore storage errors (e.g. private browsing).
    }
  }, [theme])

  return <AppRoutes />
}

export default App