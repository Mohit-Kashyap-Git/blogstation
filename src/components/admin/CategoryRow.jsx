import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Alert from '../ui/Alert'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { getCategoryErrorMessage } from '../../utils/categoryErrors'
import { categoryNameRules } from '../../utils/validation'

// `onRename(category, name)` should throw if it fails.
function CategoryRow({ category, isBusy, onRename, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { name: category.name }, mode: 'onTouched' })

  function startEditing() {
    reset({ name: category.name }) // the name may have changed since the form was created
    setIsEditing(true)
  }

  async function onSubmit({ name }) {
    if (name === category.name) {
      setIsEditing(false)
      return
    }
    try {
      await onRename(category, name)
      setIsEditing(false)
    } catch (error) {
      console.error(error)
      setError('root.serverError', { message: getCategoryErrorMessage(error) })
    }
  }

  const inUse = category.postCount > 0

  return (
    <li className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900">
      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
          {errors.root?.serverError && <Alert>{errors.root.serverError.message}</Alert>}
          <Input label="Category name" type="text" error={errors.name?.message} {...register('name', categoryNameRules)} />
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
            <Button variant="secondary" size="sm" disabled={isSubmitting} onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold">{category.name}</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              <span className="font-mono">{category.slug}</span> · {category.postCount}{' '}
              {category.postCount === 1 ? 'post' : 'posts'}
            </p>
            {inUse && (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Can't be deleted while posts use it.
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" size="sm" disabled={isBusy} onClick={startEditing}>Rename</Button>
            <Button variant="dangerGhost" size="sm" disabled={isBusy || inUse} onClick={() => onDelete(category)}>
              Delete
            </Button>
          </div>
        </div>
      )}
    </li>
  )
}

export default CategoryRow