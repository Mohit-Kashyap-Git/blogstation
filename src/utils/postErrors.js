// Turns an Appwrite error into a message that is safe to show users.
export function getPostErrorMessage(error) {
  if (error?.type === 'storage_file_type_unsupported') {
    return 'That image type is not supported. Use JPG, PNG, or WebP.'
  }
  if (error?.type === 'storage_invalid_file_size' || error?.code === 413) {
    return 'That image is too large. The maximum size is 2 MB.'
  }
  
  switch (error?.code) {
    case 401:
      return 'Your session has expired. Please log in again.'
    case 404:
      return 'This post could not be found.'
    case 409:
      return 'A post with this URL already exists. Please try saving again.'
    case 429:
      return 'Too many requests. Please wait a moment and try again.'
    default:
      return 'Something went wrong. Please try again.'
  }
}