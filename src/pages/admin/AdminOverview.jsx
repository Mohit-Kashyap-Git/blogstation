import ErrorState from '../../components/ui/ErrorState'
import StatCard from '../../components/ui/StatCard'
import { useAsync } from '../../hooks/useAsync'
import { getAdminStats } from '../../services/adminService'

function AdminOverview() {
  // getAdminStats is a module-level function, so its identity is stable.
  const { data: stats, isLoading, error, retry } = useAsync(getAdminStats)
  const show = (value) => (isLoading ? '...' : (value ?? '–'))

  return (
    <div>
      <h1 className="text-3xl font-bold">Admin overview</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">A snapshot of everything on BlogStation.</p>

      <div className="mt-8">
        {error ? (
          <ErrorState title="Couldn't load statistics" message={error} onRetry={retry} />
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard to="/admin/posts" label="Total posts" value={show(stats?.total)} />
            <StatCard to="/admin/posts?status=published" label="Published" value={show(stats?.published)} />
            <StatCard to="/admin/posts?status=draft" label="Drafts (all authors)" value={show(stats?.draft)} />
            <StatCard to="/admin/categories" label="Categories" value={show(stats?.categories)} />
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminOverview