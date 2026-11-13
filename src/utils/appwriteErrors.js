const DEFAULT_MESSAGES = {
  0: 'Could not reach the server. Check your connection and try again.',
  401: 'Your session has expired. Please log in again.',
  429: 'Too many requests. Please wait a moment and try again.',
}

const FALLBACK_MESSAGE = 'Something went wrong. Please try again.'

// `overrides` lets each feature word things for its own context.
// Keys can be an Appwrite error type (more specific) or an HTTP status code.
export function getErrorMessage(error, overrides = {}) {
  return (
    overrides[error?.type] ??
    overrides[error?.code] ??
    DEFAULT_MESSAGES[error?.code] ??
    FALLBACK_MESSAGE
  )
}