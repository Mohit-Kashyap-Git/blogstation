import { useForm } from 'react-hook-form'
import Alert from './ui/Alert'
import Button from './ui/Button'
import Input from './ui/Input'
import Select from './ui/Select'
import Textarea from './ui/Textarea'
import { useRef, useState } from 'react'
import CoverImageField from './CoverImageField'
import { maxLengthRule, postLimits } from '../utils/validation'

const emptyValues = { title: '', categorySlug: '', excerpt: '', content: '' }

// onSubmit(values, status) where status is 'draft' or 'published'.
function PostForm({ categories, defaultValues = emptyValues, onSubmit, error, currentStatus = 'draft',  existingCoverUrl = null }) {
  // Which button was clicked. Publishing has stricter rules than saving a draft.
  const intentRef = useRef('draft')
  const [cover, setCover] = useState({ file: null, remove: false })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues, mode: 'onTouched' })

  const isPublished = currentStatus === 'published'
  const draftLabel = isPublished ? 'Move to drafts' : 'Save draft'
  const draftBusyLabel = isPublished ? 'Moving...' : 'Saving...'
  const publishLabel = isPublished ? 'Save changes' : 'Publish'
  const publishBusyLabel = isPublished ? 'Saving...' : 'Publishing...'

  // Required only when publishing, so half-written drafts can still be saved.
  const requiredToPublish = (message) => (value) =>
    intentRef.current !== 'published' || value.trim() !== '' || message

  return (
    <form
      onSubmit={handleSubmit((values) => onSubmit(values, intentRef.current, cover))}
      noValidate
      className="space-y-5"
    >
      {error && <Alert>{error}</Alert>}

      <Input
        label="Title"
        type="text"
        // Enter in the title must not submit, or it could publish by accident.
        onKeyDown={(event) => event.key === 'Enter' && event.preventDefault()}
        error={errors.title?.message}
        {...register('title', {
          setValueAs: (value) => value.trim(),
          required: 'Title is required',
          maxLength: maxLengthRule(postLimits.title, 'Title'),
        })}
      />

      <Select
        label="Category"
        error={errors.categorySlug?.message}
        {...register('categorySlug', { validate: requiredToPublish('Choose a category to publish') })}
      >
        <option value="">Select a category</option>
        {categories.map((category) => (
          <option key={category.slug} value={category.slug}>
            {category.name}
          </option>
        ))}
      </Select>

      <CoverImageField existingUrl={existingCoverUrl} onChange={setCover} />

      <Textarea
        label="Excerpt"
        rows={3}
        hint="A short summary shown on blog cards (max 300 characters)."
        error={errors.excerpt?.message}
        {...register('excerpt', {
          setValueAs: (value) => value.trim(),
          maxLength: maxLengthRule(postLimits.excerpt, 'Excerpt'),
          validate: requiredToPublish('Write an excerpt to publish'),
        })}
      />

      <Textarea
        label="Content"
        rows={14}
        hint="Plain text. Separate paragraphs with a blank line."
        error={errors.content?.message}
        {...register('content', {
          setValueAs: (value) => value.trim(),
          maxLength: maxLengthRule(postLimits.content, 'Content'),
          validate: requiredToPublish('Write some content to publish'),
        })}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button
          type="submit"
          variant="secondary"
          disabled={isSubmitting}
          onClick={() => (intentRef.current = 'draft')}
        >
          {isSubmitting && intentRef.current === 'draft' ? draftBusyLabel : draftLabel}
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          onClick={() => (intentRef.current = 'published')}
        >
          {isSubmitting && intentRef.current === 'published' ? publishBusyLabel : publishLabel}
        </Button>
      </div>
    </form>
  )
}

export default PostForm