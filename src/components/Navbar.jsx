import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import { APP_NAME } from '../utils/constants'
import Button from './ui/Button'
import Container from './ui/Container'
import ThemeToggle from './ThemeToggle'

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/blogs', label: 'Blogs' },
]

const linkClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'text-indigo-600 dark:text-indigo-400'
      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
  }`

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <Container className="flex h-16 items-center justify-between">
        <Link to="/" onClick={closeMenu} className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
          {APP_NAME}
        </Link>

        {/* Desktop navigation */}
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="hidden items-center gap-2 md:flex">
            <Button to="/login" variant="ghost" size="sm">Log in</Button>
            <Button to="/register" size="sm">Sign up</Button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-indigo-500 md:hidden dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d={menuOpen ? 'M6 6l12 12M18 6L6 18' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>
      </Container>

      {/* Mobile navigation */}
      {menuOpen && (
        <nav id="mobile-menu" aria-label="Mobile" className="border-t border-slate-200 md:hidden dark:border-slate-800">
          <Container className="flex flex-col gap-1 py-3">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} onClick={closeMenu} className={linkClass}>
                {link.label}
              </NavLink>
            ))}
            <div className="mt-2 flex gap-2">
              <Button to="/login" variant="secondary" onClick={closeMenu} className="flex-1">Log in</Button>
              <Button to="/register" onClick={closeMenu} className="flex-1">Sign up</Button>
            </div>
          </Container>
        </nav>
      )}
    </header>
  )
}

export default Navbar