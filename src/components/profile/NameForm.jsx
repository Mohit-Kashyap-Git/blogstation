import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import Alert from '../ui/Alert'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { selectUser, updateProfileName } from '../../features/auth/authSlice'
import { updateAuthorName } from '../../services/postService'

function NameForm() {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const [message, setMessage] = useState(null) // { tone, text }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({ defaultValues: { name: user.name }, mode: 'onTouched' })

  async function onSubmit({ name }) {
    setMessage(null)

    const result = await dispatch(updateProfileName(name))
    if (!updateProfileName.fulfilled.match(result)) {
      setMessage({ tone: 'error', text: result.payload })
      return
    }

    reset({ name }) // the saved value becomes the new baseline
    try {
      await updateAuthorName(user.id, name)
      setMessage({ tone: 'success', text: 'Your name has been updated.' })
    } catch (error) {
      console.error(error)
      setMessage({
        tone: 'info',
        text: 'Your name was updated, but some of your posts still show the old name. Changing your name again will update them.',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {message && <Alert tone={message.tone}>{message.text}</Alert>}

      <Input
        label="Name"
        type="text"
        autoComplete="name"
        error={errors.name?.message}
        {...register('name', {
          setValueAs: (value) => value.trim(),
          required: 'Name is required',
          minLength: { value: 2, message: 'Name must be at least 2 characters' },
          maxLength: { value: 50, message: 'Name must be 50 characters or fewer' },
        })}
      />

      <Button type="submit" disabled={isSubmitting || !isDirty}>
        {isSubmitting ? 'Saving...' : 'Save name'}
      </Button>
    </form>
  )
}

export default NameForm