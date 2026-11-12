// "My First Post!" -> "my-first-post-3f9a1c2b"
export function generateSlug(title) {
  const base = title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/, '')

  // The random suffix keeps slugs unique, since the slug column has a unique index.
  return `${base || 'post'}-${crypto.randomUUID().slice(0, 8)}`
}