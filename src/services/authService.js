import { ID } from 'appwrite'
import { account } from '../lib/appwrite'
import { ADMIN_LABEL } from '../utils/constants'

// Appwrite returns many fields. We keep only what the UI needs.
function toUser(appwriteUser) {
  return {
    id: appwriteUser.$id,
    name: appwriteUser.name,
    email: appwriteUser.email,
    joinedAt: appwriteUser.$createdAt,
    isAdmin: appwriteUser.labels?.includes(ADMIN_LABEL) ?? false,
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

export async function updateName(name) {
  return toUser(await account.updateName({ name }))
}

// Appwrite checks the current password server-side and applies your password policy.
export async function changePassword({ currentPassword, newPassword }) {
  await account.updatePassword({ password: newPassword, oldPassword: currentPassword })
}

// True unless Appwrite explicitly says there is no session (401).
// A network error doesn't prove the session ended, so it counts as "still active".
export async function isSessionActive() {
  try {
    await account.get()
    return true
  } catch (error) {
    return error.code !== 401
  }
}