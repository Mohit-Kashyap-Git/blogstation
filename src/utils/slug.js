// "My First Post!" -> "my-first-post"
export function slugify(text, maxLength = 80) {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, maxLength)
    .replace(/-+$/, '')
}

// "My First Post!" -> "my-first-post-3f9a1c2b"
export function generateSlug(title) {
  // The random suffix keeps post slugs unique (the slug column has a unique index).
  return `${slugify(title) || 'post'}-${crypto.randomUUID().slice(0, 8)}`
}