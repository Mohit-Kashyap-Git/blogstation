import { getErrorMessage } from './appwriteErrors'

export function getPostErrorMessage(error) {
  return getErrorMessage(error, {
    storage_file_type_unsupported: 'That image type is not supported. Use JPG, PNG, or WebP.',
    storage_invalid_file_size: 'That image is too large. The maximum size is 2 MB.',
    413: 'That image is too large. The maximum size is 2 MB.',
    404: 'This post could not be found.',
    409: 'A post with this URL already exists. Please try saving again.',
    401: 'Your session has expired. Log in again (a new tab keeps your text here), then try saving once more.',
    user_unauthorized: "You don't have permission to do that.",
  })
}