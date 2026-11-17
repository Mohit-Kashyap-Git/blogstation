import { useSelector } from 'react-redux'
import NameForm from '../components/profile/NameForm'
import PasswordForm from '../components/profile/PasswordForm'
import Card from '../components/ui/Card'
import Container from '../components/ui/Container'
import { selectUser } from '../features/auth/authSlice'
import { useMyPostCounts } from '../hooks/useMyPostCounts'
import { formatDate } from '../utils/formatDate'
import StatCard from '../components/ui/StatCard'


function Profile() {
  const user = useSelector(selectUser)
  const { counts, isLoading, error } = useMyPostCounts(user.id)

  const display = (value) => (isLoading ? '...' : error ? '–' : value)

  return (
    <Container className="max-w-3xl py-12">
      <header className="flex items-center gap-4">
        <span
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-2xl font-semibold text-white"
          aria-hidden="true"
        >
          {user.name.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold sm:text-3xl">{user.name}</h1>
          <p className="truncate text-slate-600 dark:text-slate-400">{user.email}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Member since <time dateTime={user.joinedAt}>{formatDate(user.joinedAt)}</time>
          </p>
        </div>
      </header>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <StatCard to="/dashboard" label="Published posts" value={display(counts?.published)} />
        <StatCard to="/dashboard" label="Drafts" value={display(counts?.draft)} />
      </div>

      <div className="mt-8 space-y-6">
        <Card title="Display name" description="Shown as the author on your published posts.">
          <NameForm />
        </Card>

        <Card title="Change password" description="You'll need your current password to set a new one.">
          <PasswordForm />
        </Card>
      </div>
    </Container>
  )
}

export default Profile