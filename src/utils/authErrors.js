import { getErrorMessage } from './appwriteErrors'

// Appwrite's 400 messages are validation messages (e.g. "Password is too common")
// and are already written for users, so we pass them through.
export function getAuthErrorMessage(error) {
  if (error?.code === 400) return error.message

  return getErrorMessage(error, {
    user_session_already_exists: 'You are already logged in.',
    401: 'Invalid email or password.',
    409: 'An account with this email already exists.',
  })
}

// A 401 here means the *current* password was wrong, not a failed login.
export function getPasswordChangeErrorMessage(error) {
  if (error?.code === 400) return error.message

  return getErrorMessage(error, {
    401: 'Your current password is incorrect.',
  })
}