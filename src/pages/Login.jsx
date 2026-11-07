import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router'
import Alert from '../components/ui/Alert'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import {
  clearAuthError,
  loginUser,
  selectAuthError,
  selectIsSubmitting,
} from '../features/auth/authSlice'

function Login() {
  const dispatch = useDispatch()
  const isSubmitting = useSelector(selectIsSubmitting)
  const authError = useSelector(selectAuthError)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: '', password: '' }, mode: 'onTouched' })

  // Don't carry an old server error over to another page.
  useEffect(() => () => dispatch(clearAuthError()), [dispatch])

  function onSubmit(values) {
    dispatch(loginUser(values))
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Log in</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Welcome back. Enter your details to continue.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
        {authError && <Alert>{authError}</Alert>}

        <Input
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            setValueAs: (value) => value.trim(),
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' },
          })}
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