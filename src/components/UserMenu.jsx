import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router'
import { selectUser } from '../features/auth/authSlice'
import { useLogout } from '../hooks/useLogout'

function UserMenu() {
  const user = useSelector(selectUser)
  const logout = useLogout()
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  // While open: close on outside click or Escape.
  useEffect(() => {
    if (!open) return

    function handlePointerDown(event) {
      if (!menuRef.current.contains(event.target)) setOpen(false)
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const itemClass =
    'block w-full rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-indigo-500 dark:text-slate-200 dark:hover:bg-slate-800'

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="user-menu"
        aria-label="Account menu"
        className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-indigo-500 dark:hover:bg-slate-800"
      >
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white"
          aria-hidden="true"
        >
          {user.name.charAt(0).toUpperCase()}
        </span>
        <span className="max-w-32 truncate text-sm font-medium">{user.name}</span>
      </button>

      {open && (
        <div
          id="user-menu"
          className="absolute right-0 mt-2 w-60 rounded-xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="border-b border-slate-200 px-3 pb-2 pt-1 dark:border-slate-800">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
          </div>
          <div className="mt-2 space-y-1">
            <Link to="/dashboard" onClick={() => setOpen(false)} className={itemClass}>
              Dashboard
            </Link>
            <button type="button" onClick={logout} className={itemClass}>
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserMenu