import { getErrorMessage } from './appwriteErrors'

export function getCategoryErrorMessage(error) {
  return getErrorMessage(error, {
    category_in_use: 'This category is used by posts. Move or delete those posts first.',
    user_unauthorized: "You don't have permission to do that.",
    409: 'A category with this name already exists.',
  })
}