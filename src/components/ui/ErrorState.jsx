import Button from './Button'
import EmptyState from './EmptyState'

function ErrorState({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div role="alert">
      <EmptyState
        title={title}
        description={message}
        action={onRetry && <Button variant="secondary" onClick={onRetry}>Try again</Button>}
      />
    </div>
  )
}

export default ErrorState