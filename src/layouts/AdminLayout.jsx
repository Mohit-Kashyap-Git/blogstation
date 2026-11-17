import { NavLink, Outlet } from 'react-router'
import Container from '../components/ui/Container'

// Links are added here as each admin page is built.
const adminLinks = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/posts', label: 'Posts' },
]

const linkClass = ({ isActive }) =>
  `whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-indigo-500 ${
    isActive
      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300'
      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
  }`

function AdminLayout() {
  return (
    <Container className="py-8 lg:py-12">
      <div className="lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-10">
        <nav
          aria-label="Admin"
          className="-mx-4 mb-6 flex gap-1 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:sticky lg:top-24 lg:mx-0 lg:mb-0 lg:flex-col lg:self-start lg:overflow-visible lg:px-0"
        >
          {adminLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </Container>
  )
}

export default AdminLayout