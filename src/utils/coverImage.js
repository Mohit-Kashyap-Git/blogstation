export const COVER_MAX_BYTES = 2 * 1024 * 1024 // keep in sync with the bucket's max file size
export const COVER_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const COVER_ACCEPT = COVER_TYPES.join(',')

// Returns an error message, or null if the file is fine.
export function validateCoverFile(file) {
  if (!COVER_TYPES.includes(file.type)) return 'Please choose a JPG, PNG, or WebP image.'
  if (file.size > COVER_MAX_BYTES) return 'The image is too large. The maximum size is 2 MB.'
  return null
}