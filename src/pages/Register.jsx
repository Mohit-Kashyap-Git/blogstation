import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router'
import Alert from '../components/ui/Alert'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { confirmPasswordRules, emailRules, nameRules, newPasswordRules } from '../utils/validation'
import {
  clearAuthError,
  registerUser,
  selectAuthError,
  selectIsSubmitting,
} from '../features/auth/authSlice'

function Register() {
  const dispatch = useDispatch()
  const isSubmitting = useSelector(selectIsSubmitting)
  const authError = useSelector(selectAuthError)

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
    mode: 'onTouched',
  })

  useEffect(() => () => dispatch(clearAuthError()), [dispatch])

  function onSubmit({ name, email, password }) {
    // confirmPassword is only for the form. It is never sent to Appwrite.
    dispatch(registerUser({ name, email, password }))
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Create an account</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Start writing and sharing your stories.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
        {authError && <Alert>{authError}</Alert>}

        <Input
          label="Name"
          type="text"
          autoComplete="name"
          error={errors.name?.message}
          {...register('name', nameRules)}
        />

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
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password', newPasswordRules)}
        />

        <Input
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', confirmPasswordRules(() => getValues('password')))}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Creating account...' : 'Sign up'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
          Log in
        </Link>
      </p>
    </div>
  )
}

export default Register