// Placeholder covers until posts have real images.
const gradients = [
  'from-indigo-500 to-purple-500',
  'from-sky-500 to-indigo-500',
  'from-emerald-500 to-teal-500',
  'from-orange-400 to-rose-500',
  'from-fuchsia-500 to-pink-500',
]

// Same post id always gets the same gradient.
export function getGradient(id) {
  const sum = [...String(id)].reduce((total, char) => total + char.charCodeAt(0), 0)
  return gradients[sum % gradients.length]
}