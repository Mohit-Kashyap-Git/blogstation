import { useForm } from 'react-hook-form'
import Alert from '../ui/Alert'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { getCategoryErrorMessage } from '../../utils/categoryErrors'
import { categoryNameRules } from '../../utils/validation'

// `onCreate(name)` should throw if it fails. The error is shown inside the form.
function CategoryForm({ onCreate }) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { name: '' }, mode: 'onTouched' })

  async function onSubmit({ name }) {
    try {
      await onCreate(name)
      reset()
    } catch (error) {
      console.error(error)
      setError('root.serverError', { message: getCategoryErrorMessage(error) })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
      {errors.root?.serverError && <Alert>{errors.root.serverError.message}</Alert>}

      <Input
        label="Name"
        type="text"
        hint="The URL-friendly slug is created from the name and can't be changed later, because posts refer to it."
        error={errors.name?.message}
        {...register('name', categoryNameRules)}
      />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Adding...' : 'Add category'}
      </Button>
    </form>
  )
}

export default CategoryForm