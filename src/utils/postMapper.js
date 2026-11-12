import { getCoverUrl } from '../services/storageService'

// Converts an Appwrite row into the shape BlogCard expects.
export function toCardData(row, categoryNames = {}) {
  return {
    id: row.$id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? '',
    category: categoryNames[row.categorySlug] ?? '',
    author: row.authorName,
    date: row.publishedAt,
    coverImage: row.coverImageId ? getCoverUrl(row.coverImageId) : null,
  }
}