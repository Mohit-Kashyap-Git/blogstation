// Turns an Appwrite error into a message that is safe and friendly to show users.
export function getAuthErrorMessage(error) {
  if (error?.type === 'user_session_already_exists') {
    return 'You are already logged in.'
  }

  switch (error?.code) {
    case 400:
      // Validation errors (e.g. password too short) are already readable.
      return error.message
    case 401:
      return 'Invalid email or password.'
    case 409:
      return 'An account with this email already exists.'
    case 429:
      return 'Too many attempts. Please wait a moment and try again.'
    default:
      return 'Something went wrong. Check your connection and try again.'
  }
}