const EMAIL_PATTERN = /^\S+@\S+\.\S+$/
const trim = (value) => value.trim()
import { slugify } from './slug'

export const maxLengthRule = (max, label) => ({
  value: max,
  message: `${label} must be ${max} characters or fewer`,
})

// Keep these in sync with the column sizes in the Appwrite `posts` table.
export const postLimits = { title: 150, excerpt: 300, content: 50000 }

export const emailRules = {
  setValueAs: trim,
  required: 'Email is required',
  pattern: { value: EMAIL_PATTERN, message: 'Enter a valid email address' },
}

export const nameRules = {
  setValueAs: trim,
  required: 'Name is required',
  minLength: { value: 2, message: 'Name must be at least 2 characters' },
  maxLength: maxLengthRule(50, 'Name'),
}

// For choosing a password (register, change password). Not for logging in.
export const newPasswordRules = {
  required: 'Password is required',
  minLength: { value: 8, message: 'Password must be at least 8 characters' },
  maxLength: { value: 256, message: 'Password is too long' },
}

// Pass a function that returns the password to compare with:
// register('confirmPassword', confirmPasswordRules(() => getValues('password')))
export function confirmPasswordRules(getPassword) {
  return {
    required: 'Please confirm your password',
    validate: (value) => value === getPassword() || 'Passwords do not match',
  }
}

// 50 / 60 match the `name` and `slug` column sizes in the Appwrite `categories` table.
export const categoryNameRules = {
  setValueAs: trim,
  required: 'Category name is required',
  maxLength: maxLengthRule(50, 'Name'),
  validate: (value) => slugify(value, 60) !== '' || 'Use at least one letter or number (a-z, 0-9)',
}