import { forwardRef, useId } from 'react'
import FormField, { controlClass } from './FormField'

// Pass <option> elements as children.
const Select = forwardRef(function Select({ label, error, hint, children, ...props }, ref) {
  const id = useId()

  return (
    <FormField id={id} label={label} error={error} hint={hint}>
      <select
        id={id}
        ref={ref}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        className={controlClass(error)}
        {...props}
      >
        {children}
      </select>
    </FormField>
  )
})

export default Select