import { ID, Permission, Role } from 'appwrite'
import { appwriteConfig, storage } from '../lib/appwrite'

const { coversBucketId: bucketId } = appwriteConfig

export function uploadCover(file, userId) {
  return storage.createFile({
    bucketId,
    fileId: ID.unique(),
    file,
    // Reading is public (bucket level). Only the owner can change or remove it.
    permissions: [Permission.update(Role.user(userId)), Permission.delete(Role.user(userId))],
  })
}

// Best effort: a failed cleanup should never break the user's save or delete.
export async function deleteCover(fileId) {
  try {
    await storage.deleteFile({ bucketId, fileId })
  } catch (error) {
    console.error('Could not delete cover image', error)
  }
}

export function getCoverUrl(fileId) {
  // String() works whether the SDK returns a string or a URL object.
  return String(storage.getFileView({ bucketId, fileId }))
}