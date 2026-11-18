import { Client, Query, TablesDB, Users } from 'node-appwrite'

const ADMIN_LABEL = process.env.ADMIN_LABEL ?? 'admin'
const DATABASE_ID = process.env.DATABASE_ID
const POSTS_TABLE_ID = process.env.POSTS_TABLE_ID

// An error whose message is safe to send back to the caller.
class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

function clampInt(value, min, max, fallback) {
  const number = Number.parseInt(value, 10)
  if (Number.isNaN(number)) return fallback
  return Math.min(max, Math.max(min, number))
}

function requireString(value) {
  if (typeof value !== 'string' || value.trim() === '') throw new HttpError(400, 'Invalid request.')
  return value.trim()
}

async function listUsers({ users }, { search, limit, offset }) {
  const term = typeof search === 'string' ? search.trim().slice(0, 100) : ''

  const result = await users.list({
    queries: [
      Query.limit(clampInt(limit, 1, 50, 10)),
      Query.offset(clampInt(offset, 0, 100000, 0)),
      Query.orderDesc('$createdAt'),
    ],
    search: term || undefined,
  })

  // Return only what the admin screen needs.
  return {
    total: result.total,
    users: result.users.map((user) => ({
      id: user.$id,
      name: user.name,
      email: user.email,
      isActive: user.status,
      isAdmin: user.labels.includes(ADMIN_LABEL),
      registeredAt: user.registration,
      lastActiveAt: user.accessedAt,
    })),
  }
}

async function setUserStatus({ users, caller }, { userId, blocked }) {
  const id = requireString(userId)
  if (typeof blocked !== 'boolean') throw new HttpError(400, 'Invalid request.')
  if (id === caller.$id) throw new HttpError(400, 'You cannot change your own status.')

  const target = await users.get({ userId: id }) // a missing user becomes a 404 below
  if (target.labels.includes(ADMIN_LABEL)) {
    throw new HttpError(403, 'Admin accounts cannot be restricted here.')
  }

  await users.updateStatus({ userId: id, status: !blocked })
  // Blocking should end the user's current sessions, not just stop new logins.
  if (blocked) await users.deleteSessions({ userId: id })

  return { id, isActive: !blocked }
}

async function unpublishPost({ tablesDB }, { postId }) {
  const rowId = requireString(postId)
  const post = await tablesDB.getRow({ databaseId: DATABASE_ID, tableId: POSTS_TABLE_ID, rowId })

  if (post.status !== 'published') throw new HttpError(409, 'This post is not published.')

  // Remove public read access but keep every other permission (the owner's).
  // We read the permissions from the row, and don't trust the `authorId` field,
  // which the author's own browser wrote.
  const permissions = post.$permissions.filter((permission) => permission !== 'read("any")')

  await tablesDB.updateRow({
    databaseId: DATABASE_ID,
    tableId: POSTS_TABLE_ID,
    rowId,
    data: { status: 'draft', publishedAt: null },
    permissions,
  })

  return { id: rowId, status: 'draft' }
}

// The only things a caller can ask for.
const actions = { listUsers, setUserStatus, unpublishPost }

export default async ({ req, res, error }) => {
  try {
    // Set by Appwrite when a signed-in user calls through createExecution.
    // It is empty for guests, Console runs, and direct calls to the function URL.
    const callerId = req.headers['x-appwrite-user-id']
    if (!callerId) throw new HttpError(401, 'Authentication required.')

    const client = new Client()
      .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
      .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
      .setKey(req.headers['x-appwrite-key'])

    const users = new Users(client)
    const tablesDB = new TablesDB(client)

    // Authorization: ask Appwrite who the caller is. Never trust the request body for this.
    let caller
    try {
      caller = await users.get({ userId: callerId })
    } catch (err) {
      // The caller isn't a project user (for example a Console run), so they are not authenticated.
      if (err?.code === 404) throw new HttpError(401, 'Authentication required.')
      throw err
    }

    if (!caller.status || !caller.labels.includes(ADMIN_LABEL)) {
      throw new HttpError(403, 'Admin access required.')
    }

    const body = req.bodyJson && typeof req.bodyJson === 'object' ? req.bodyJson : {}
    const { action, ...params } = body
    if (typeof action !== 'string' || !Object.hasOwn(actions, action)) {
      throw new HttpError(400, 'Unknown action.')
    }

    const data = await actions[action]({ users, tablesDB, caller }, params)
    return res.json({ ok: true, data })
  } catch (err) {
    if (err instanceof HttpError) return res.json({ ok: false, message: err.message }, err.status)
    if (err?.code === 404) return res.json({ ok: false, message: 'Not found.' }, 404)

    error(err?.message ?? String(err)) // full detail goes to the Console logs only
    return res.json({ ok: false, message: 'Something went wrong.' }, 500)
  }
}