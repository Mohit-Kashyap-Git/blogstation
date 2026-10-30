import { Client, Account, Storage } from 'appwrite'

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID

if (!endpoint || !projectId) {
  throw new Error(
    'Missing Appwrite config. Check VITE_APPWRITE_ENDPOINT and VITE_APPWRITE_PROJECT_ID in .env, then restart the dev server.'
  )
}

export const client = new Client().setEndpoint(endpoint).setProject(projectId)

export const account = new Account(client)
export const storage = new Storage(client)