import { Client, Account, Storage, TablesDB } from 'appwrite'

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID

export const appwriteConfig = {
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  postsTableId: import.meta.env.VITE_APPWRITE_POSTS_TABLE_ID,
  categoriesTableId: import.meta.env.VITE_APPWRITE_CATEGORIES_TABLE_ID,
  coversBucketId: import.meta.env.VITE_APPWRITE_COVERS_BUCKET_ID,
}

const required = { endpoint, projectId, ...appwriteConfig }
const missing = Object.entries(required)
  .filter(([, value]) => !value)
  .map(([key]) => key)

if (missing.length > 0) {
  throw new Error(
    `Missing Appwrite config: ${missing.join(', ')}. Check your .env file, then restart the dev server.`
  )
}

export const client = new Client().setEndpoint(endpoint).setProject(projectId)

export const account = new Account(client)
export const tablesDB = new TablesDB(client)
export const storage = new Storage(client)