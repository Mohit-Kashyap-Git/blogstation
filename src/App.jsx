import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import AppRoutes from './routes/AppRoutes'
import { selectTheme, STORAGE_KEY } from './features/theme/themeSlice'

function App() {
  const theme = useSelector(selectTheme)

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