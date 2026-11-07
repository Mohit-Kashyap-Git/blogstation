import { useSelector } from 'react-redux'
import Container from '../components/ui/Container'
import { selectUser } from '../features/auth/authSlice'

function Dashboard() {
  const user = useSelector(selectUser)

  return (
    <Container className="py-12">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Welcome, {user.name}. Your posts will appear here in Phase 4.
      </p>
    </Container>
  )
}

export default Dashboard