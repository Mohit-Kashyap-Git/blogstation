// What a post still needs before it can be published.
export function getMissingForPublish(post) {
  const missing = []
  if (!post.categorySlug) missing.push('a category')
  if (!post.excerpt?.trim()) missing.push('an excerpt')
  if (!post.content?.trim()) missing.push('content')
  return missing
}