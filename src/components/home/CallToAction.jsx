import Container from '../ui/Container'
import Button from '../ui/Button'

function CallToAction() {
  return (
    <section className="py-16">
      <Container>
        <div className="rounded-2xl bg-indigo-600 px-6 py-12 text-center text-white sm:px-12 dark:bg-indigo-700">
          <h2 className="text-2xl font-bold sm:text-3xl">Have something to say?</h2>
          <p className="mx-auto mt-2 max-w-xl text-indigo-100">
            Create a free account, write your first post, and reach readers today.
          </p>
          <Button
            to="/register"
            size="lg"
            variant='light'
            className="mt-6"
          >
            Start writing
          </Button>
        </div>
      </Container>
    </section>
  )
}

export default CallToAction