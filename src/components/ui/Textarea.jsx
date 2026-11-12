import { forwardRef, useId } from 'react'
import FormField, { controlClass } from './FormField'

const Textarea = forwardRef(function Textarea({ label, error, hint, ...props }, ref) {
  const id = useId()

  return (
    <FormField id={id} label={label} error={error} hint={hint}>
      <textarea
        id={id}
        ref={ref}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        className={controlClass(error)}
        {...props}
      />
    </FormField>
  )
})

export default Textarea