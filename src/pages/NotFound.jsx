import Container from '../components/ui/Container'
import Button from '../components/ui/Button'

function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">404</p>
      <h1 className="mt-2 text-3xl font-bold">Page not found</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">The page you're looking for doesn't exist.</p>
      <Button to="/" className="mt-6">Back to home</Button>
    </Container>
  )
}

export default NotFound