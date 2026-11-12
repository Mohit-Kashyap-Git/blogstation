import { ID, Permission, Query, Role } from 'appwrite'
import { appwriteConfig, tablesDB } from '../lib/appwrite'
import { generateSlug } from '../utils/slug'
import { deleteCover, uploadCover } from './storageService'

const { databaseId, postsTableId: tableId } = appwriteConfig

// The owner always has full access. A published post is also readable by anyone.
// This is what keeps drafts private: the server enforces it, not our UI.
function buildPermissions(userId, status) {
  const permissions = [
    Permission.read(Role.user(userId)),
    Permission.update(Role.user(userId)),
    Permission.delete(Role.user(userId)),
  ]
  if (status === 'published') permissions.push(Permission.read(Role.any()))
  return permissions
}

// Only touch `publishedAt` when the status actually changes.
function getStatusData(previousStatus, status) {
  if (status === previousStatus) return { status }
  return {
    status,
    publishedAt: status === 'published' ? new Date().toISOString() : null,
  }
}

export async function createPost({ values, status, user, coverFile }) {
  // Upload first, so the row can point at the file.
  const coverImageId = coverFile ? (await uploadCover(coverFile, user.id)).$id : null

  try {
    return await tablesDB.createRow({
      databaseId,
      tableId,
      rowId: ID.unique(),
      data: {
        title: values.title,
        slug: generateSlug(values.title),
        excerpt: values.excerpt,
        content: values.content,
        categorySlug: values.categorySlug || null,
        coverImageId,
        status,
        authorId: user.id,
        authorName: user.name,
        publishedAt: status === 'published' ? new Date().toISOString() : null,
      },
      permissions: buildPermissions(user.id, status),
    })
  } catch (error) {
    // Don't leave an orphaned file behind if saving the post failed.
    if (coverImageId) await deleteCover(coverImageId)
    throw error
  }
}

export async function getMyPosts(userId) {
  const response = await tablesDB.listRows({
    databaseId,
    tableId,
    queries: [
      Query.equal('authorId', userId),
      Query.orderDesc('$updatedAt'),
      Query.limit(100),
    ],
  })
  return response.rows
}

export function getPostById(postId) {
  return tablesDB.getRow({ databaseId, tableId, rowId: postId })
}

// The slug, authorId and authorName are never changed on edit.
// coverFile = a newly chosen image. removeCover = the user cleared the cover.
export async function updatePost({ post, values, status, userId, coverFile, removeCover }) {
  const previousCoverId = post.coverImageId ?? null
  let coverImageId = previousCoverId
  let uploadedId = null

  if (coverFile) {
    uploadedId = (await uploadCover(coverFile, userId)).$id
    coverImageId = uploadedId
  } else if (removeCover) {
    coverImageId = null
  }

  try {
    const updated = await tablesDB.updateRow({
      databaseId,
      tableId,
      rowId: post.$id,
      data: {
        title: values.title,
        excerpt: values.excerpt,
        content: values.content,
        categorySlug: values.categorySlug || null,
        coverImageId,
        ...getStatusData(post.status, status),
      },
      permissions: buildPermissions(userId, status),
    })

    // Only after the row is saved is it safe to delete the old file.
    if (previousCoverId && previousCoverId !== coverImageId) await deleteCover(previousCoverId)
    return updated
  } catch (error) {
    if (uploadedId) await deleteCover(uploadedId)
    throw error
  }
}

// Quick publish/unpublish from the list, without opening the editor.
export function setPostStatus({ post, status, userId }) {
  return tablesDB.updateRow({
    databaseId,
    tableId,
    rowId: post.$id,
    data: getStatusData(post.status, status),
    permissions: buildPermissions(userId, status),
  })
}

// Takes the whole post (not just the ID) so we know which cover file to remove.
export async function deletePost(post) {
  await tablesDB.deleteRow({ databaseId, tableId, rowId: post.$id })
  if (post.coverImageId) await deleteCover(post.coverImageId)
}

// List pages don't need the (large) article body, so we only select card columns.
const CARD_COLUMNS = ['slug', 'title', 'excerpt', 'categorySlug', 'authorName', 'publishedAt', 'coverImageId']

export async function getPublishedPosts({ page = 1, pageSize, categorySlug, search }) {
  const queries = [
    // Required even though drafts are private: a logged-in user's results
    // also include their own drafts, and those must not show on public pages.
    Query.equal('status', 'published'),
    Query.orderDesc('publishedAt'),
    Query.limit(pageSize),
    Query.offset((page - 1) * pageSize),
    Query.select(CARD_COLUMNS),
  ]

  if (categorySlug) queries.push(Query.equal('categorySlug', categorySlug))

  const term = search?.trim().slice(0, 100)
  if (term) {
    queries.push(Query.or([Query.search('title', term), Query.search('excerpt', term)]))
  }

  const response = await tablesDB.listRows({ databaseId, tableId, queries })
  return { posts: response.rows, total: response.total }
}

// Detail pages are addressed by slug, so we query by slug instead of using getRow.
export async function getPublishedPostBySlug(slug) {
  const response = await tablesDB.listRows({
    databaseId,
    tableId,
    queries: [Query.equal('slug', slug), Query.equal('status', 'published'), Query.limit(1)],
  })
  return response.rows[0] ?? null
}

export async function getMyPostCounts(userId) {
  // limit(1) + select($id) keeps responses tiny. We only want the `total`.
  const countFor = async (status) => {
    const { total } = await tablesDB.listRows({
      databaseId,
      tableId,
      queries: [
        Query.equal('authorId', userId),
        Query.equal('status', status),
        Query.limit(1),
        Query.select(['$id']),
      ],
    })
    return total
  }

  const [published, draft] = await Promise.all([countFor('published'), countFor('draft')])
  return { published, draft }
}

// Keeps the copied author name on a user's posts in sync after a rename.
export async function updateAuthorName(userId, authorName) {
  const pageSize = 100
  let offset = 0
  let hasMore = true

  while (hasMore) {
    const { rows } = await tablesDB.listRows({
      databaseId,
      tableId,
      queries: [
        Query.equal('authorId', userId),
        Query.orderAsc('$createdAt'),
        Query.limit(pageSize),
        Query.offset(offset),
        Query.select(['$id', 'authorName']),
      ],
    })

    const stale = rows.filter((row) => row.authorName !== authorName)

    // Small batches so we don't fire 100 requests at once and hit rate limits.
    for (let i = 0; i < stale.length; i += 10) {
      await Promise.all(
        stale.slice(i, i + 10).map((row) =>
          tablesDB.updateRow({ databaseId, tableId, rowId: row.$id, data: { authorName } })
        )
      )
    }

    hasMore = rows.length === pageSize
    offset += pageSize
  }
}