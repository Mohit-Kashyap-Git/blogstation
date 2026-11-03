import { Link, Outlet } from 'react-router'
import { APP_NAME } from '../utils/constants'
import ThemeToggle from '../components/ThemeToggle'

function AuthLayout() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <Link to="/" className="mb-8 text-2xl font-bold text-indigo-600 dark:text-indigo-400">
        {APP_NAME}
      </Link>
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout