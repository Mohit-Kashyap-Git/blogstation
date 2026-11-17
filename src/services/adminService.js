import { Query } from 'appwrite'
import { appwriteConfig, tablesDB } from '../lib/appwrite'

const { databaseId, postsTableId, categoriesTableId } = appwriteConfig

// limit(1) + select($id) keeps responses tiny. We only want the `total`.
async function countRows(tableId, queries = []) {
  const { total } = await tablesDB.listRows({
    databaseId,
    tableId,
    queries: [...queries, Query.limit(1), Query.select(['$id'])],
  })
  return total
}

export async function getAdminStats() {
  const [published, draft, categories] = await Promise.all([
    countRows(postsTableId, [Query.equal('status', 'published')]),
    countRows(postsTableId, [Query.equal('status', 'draft')]),
    countRows(categoriesTableId),
  ])
  return { published, draft, total: published + draft, categories }
}

// List rows don't need the (large) article body.
const LIST_COLUMNS = [
  'title', 'slug', 'status', 'categorySlug', 'authorName', 'coverImageId', 'publishedAt',
]

export async function getAllPosts({ page = 1, pageSize, status, search }) {
  const queries = [
    Query.orderDesc('$updatedAt'),
    Query.limit(pageSize),
    Query.offset((page - 1) * pageSize),
    Query.select(LIST_COLUMNS),
  ]

  if (status) queries.push(Query.equal('status', status))

  const term = search?.trim().slice(0, 100)
  if (term) {
    queries.push(Query.or([Query.search('title', term), Query.search('excerpt', term)]))
  }

  const response = await tablesDB.listRows({ databaseId, tableId: postsTableId, queries })
  return { posts: response.rows, total: response.total }
}

export async function getPostForAdmin(postId) {
  try {
    return await tablesDB.getRow({ databaseId, tableId: postsTableId, rowId: postId })
  } catch (error) {
    if (error.code === 404) return null
    throw error
  }
}