import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import Alert from '../ui/Alert'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { selectUser, updateProfileName } from '../../features/auth/authSlice'
import { useToast } from '../../hooks/useToast'
import { updateAuthorName } from '../../services/postService'
import { nameRules } from '../../utils/validation'

function NameForm() {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const toast = useToast()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({ defaultValues: { name: user.name }, mode: 'onTouched' })

  async function onSubmit({ name }) {
    try {
      await dispatch(updateProfileName(name)).unwrap()
    } catch (message) {
      setError('root.serverError', { message })
      return
    }

    reset({ name }) // the saved value becomes the new baseline
    try {
      await updateAuthorName(user.id, name)
      toast.success('Your name has been updated.')
    } catch (error) {
      console.error(error)
      toast.info(
        'Your name was updated, but some of your posts still show the old name. Changing your name again will update them.'
      )
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {errors.root?.serverError && <Alert>{errors.root.serverError.message}</Alert>}

      <Input
        label="Name"
        type="text"
        autoComplete="name"
        error={errors.name?.message}
        {...register('name', nameRules)}
      />

      <Button type="submit" disabled={isSubmitting || !isDirty}>
        {isSubmitting ? 'Saving...' : 'Save name'}
      </Button>
    </form>
  )
}

export default NameForm