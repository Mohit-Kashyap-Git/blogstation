// "2026-10-20" -> "20 Oct 2026". Uses the browser's built-in Intl, no library needed.
export function formatDate(dateString) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString))
}