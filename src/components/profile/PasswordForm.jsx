import { useForm } from 'react-hook-form'
import Alert from '../ui/Alert'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { changePassword } from '../../services/authService'
import { useToast } from '../../hooks/useToast'
import { getPasswordChangeErrorMessage } from '../../utils/authErrors'
import { confirmPasswordRules, newPasswordRules } from '../../utils/validation'

const emptyValues = { currentPassword: '', newPassword: '', confirmPassword: '' }

function PasswordForm() {
  const toast = useToast()

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: emptyValues, mode: 'onTouched' })

  async function onSubmit({ currentPassword, newPassword }) {
    try {
      await changePassword({ currentPassword, newPassword })
    } catch (error) {
      console.error(error)
      setError('root.serverError', { message: getPasswordChangeErrorMessage(error) })
      return
    }

    reset(emptyValues) // never leave passwords sitting in the form
    toast.success('Your password has been changed.')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {errors.root?.serverError && <Alert>{errors.root.serverError.message}</Alert>}

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
          ...newPasswordRules,
          required: 'Enter a new password',
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
          ...confirmPasswordRules(() => getValues('newPassword')),
          required: 'Please confirm your new password',
        })}
      />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Changing...' : 'Change password'}
      </Button>
    </form>
  )
}

export default PasswordForm