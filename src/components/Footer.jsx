import { Link } from 'react-router'
import { APP_NAME } from '../utils/constants'
import Container from './ui/Container'

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
      <Container className="flex flex-col items-center justify-between gap-4 py-8 text-sm text-slate-600 sm:flex-row dark:text-slate-400">
        <p>
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </p>
        <nav aria-label="Footer" className="flex gap-4">
          <Link to="/" className="hover:text-slate-900 dark:hover:text-white">Home</Link>
          <Link to="/blogs" className="hover:text-slate-900 dark:hover:text-white">Blogs</Link>
        </nav>
      </Container>
    </footer>
  )
}

export default Footer