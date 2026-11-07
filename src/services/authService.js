import { ID } from 'appwrite'
import { account } from '../lib/appwrite'

// Appwrite returns many fields. We keep only what the UI needs.
function toUser(appwriteUser) {
  return {
    id: appwriteUser.$id,
    name: appwriteUser.name,
    email: appwriteUser.email,
  }
}

export async function register({ name, email, password }) {
  await account.create({ userId: ID.unique(), email, password, name })
  // Creating an account does not log you in, so we start a session right after.
  await account.createEmailPasswordSession({ email, password })
  return toUser(await account.get())
}

export async function login({ email, password }) {
  await account.createEmailPasswordSession({ email, password })
  return toUser(await account.get())
}

export async function logout() {
  try {
    await account.deleteSession({ sessionId: 'current' })
  } catch (error) {
    // 401 means the session was already gone, which is the result we wanted.
    if (error.code !== 401) throw error
  }
}

// Returns the logged-in user, or null for guests.
export async function getCurrentUser() {
  try {
    return toUser(await account.get())
  } catch (error) {
    if (error.code === 401) return null
    throw error
  }
}