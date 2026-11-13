import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router'
import Alert from '../components/ui/Alert'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { loginUser } from '../features/auth/authSlice'
import { emailRules } from '../utils/validation'

function Login() {
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: '', password: '' }, mode: 'onTouched' })

  // handleSubmit keeps isSubmitting true until this promise settles.
  async function onSubmit(values) {
    try {
      // On success the user lands in Redux and GuestRoute redirects away.
      await dispatch(loginUser(values)).unwrap()
    } catch (message) {
      // unwrap() throws the friendly message our thunk rejected with.
      setError('root.serverError', { message })
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Log in</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Welcome back. Enter your details to continue.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
        {errors.root?.serverError && <Alert>{errors.root.serverError.message}</Alert>}

        <Input
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email', emailRules)}
        />

        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password', { required: 'Password is required' })}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Logging in...' : 'Log in'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        Don't have an account?{' '}
        <Link to="/register" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
          Sign up
        </Link>
      </p>
    </div>
  )
}

export default Login