import { Query } from 'appwrite'
import { appwriteConfig, tablesDB } from '../lib/appwrite'

const { databaseId, categoriesTableId: tableId } = appwriteConfig

export async function getCategories() {
  const response = await tablesDB.listRows({
    databaseId,
    tableId,
    queries: [Query.limit(100)],
  })

  // TablesDB returns `rows` (the older Databases API used `documents`).
  return response.rows
  .map(({ $id, name, slug }) => ({ id: $id, name, slug }))
  .sort((a, b) => a.name.localeCompare(b.name))
}