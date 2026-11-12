import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Alert from '../ui/Alert'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { changePassword } from '../../services/authService'
import { getPasswordChangeErrorMessage } from '../../utils/authErrors'

const emptyValues = { currentPassword: '', newPassword: '', confirmPassword: '' }

function PasswordForm() {
  const [message, setMessage] = useState(null) // { tone, text }

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: emptyValues, mode: 'onTouched' })

  async function onSubmit({ currentPassword, newPassword }) {
    setMessage(null)
    try {
      await changePassword({ currentPassword, newPassword })
      reset(emptyValues) // never leave passwords sitting in the form
      setMessage({ tone: 'success', text: 'Your password has been changed.' })
    } catch (error) {
      console.error(error)
      setMessage({ tone: 'error', text: getPasswordChangeErrorMessage(error) })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {message && <Alert tone={message.tone}>{message.text}</Alert>}

      <Input
        label="Current password"
        type="password"
        autoComplete="current-password"
        error={errors.currentPassword?.message}
        {...register('currentPassword', { required: 'Enter your current password' })}
      />

      <Input
        label="New password"
        type="password"
        autoComplete="new-password"
        error={errors.newPassword?.message}
        {...register('newPassword', {
          required: 'Enter a new password',
          minLength: { value: 8, message: 'Password must be at least 8 characters' },
          maxLength: { value: 256, message: 'Password is too long' },
          validate: (value) =>
            value !== getValues('currentPassword') || 'New password must be different from the current one',
        })}
      />

      <Input
        label="Confirm new password"
        type="password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword', {
          required: 'Please confirm your new password',
          validate: (value) => value === getValues('newPassword') || 'Passwords do not match',
        })}
      />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Changing...' : 'Change password'}
      </Button>
    </form>
  )
}

export default PasswordForm