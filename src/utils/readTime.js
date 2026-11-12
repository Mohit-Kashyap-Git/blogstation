// About 200 words per minute is the usual estimate for reading speed.
export function estimateReadTime(text) {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}