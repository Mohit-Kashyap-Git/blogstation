import { useEffect, useRef, useState } from 'react'
import Button from './ui/Button'
import { COVER_ACCEPT, validateCoverFile } from '../utils/coverImage'

// Reports changes to the parent as onChange({ file, remove }).
function CoverImageField({ existingUrl = null, onChange }) {
  const inputRef = useRef(null)
  const previewRef = useRef(null) // the current blob: URL, so we can free it
  const [preview, setPreview] = useState(null)
  const [existingRemoved, setExistingRemoved] = useState(false)
  const [error, setError] = useState(null)

  // Free the preview's memory when the component goes away.
  useEffect(
    () => () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current)
    },
    []
  )

  function replacePreview(url) {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current)
    previewRef.current = url
    setPreview(url)
  }

  function handleSelect(event) {
    const file = event.target.files[0]
    event.target.value = '' // lets the user pick the same file again later
    if (!file) return

    const validationError = validateCoverFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    replacePreview(URL.createObjectURL(file))
    onChange({ file, remove: false })
  }

  function handleRemove() {
    setError(null)
    replacePreview(null)
    setExistingRemoved(true)
    onChange({ file: null, remove: Boolean(existingUrl) })
  }

  const shownUrl = preview ?? (existingRemoved ? null : existingUrl)

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium">Cover image</p>

      {shownUrl ? (
        <img src={shownUrl} alt="Cover preview" className="aspect-video w-full rounded-lg object-cover" />
      ) : (
        <div className="flex aspect-video w-full items-center justify-center rounded-lg border border-dashed border-slate-300 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          No cover image
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input ref={inputRef} type="file" accept={COVER_ACCEPT} onChange={handleSelect} className="hidden" tabIndex={-1} />
        <Button variant="secondary" size="sm" onClick={() => inputRef.current.click()}>
          {shownUrl ? 'Change image' : 'Choose image'}
        </Button>
        {shownUrl && (
          <Button variant="dangerGhost" size="sm" onClick={handleRemove}>
            Remove
          </Button>
        )}
      </div>

      {error ? (
        <p role="alert" className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : (
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">JPG, PNG, or WebP, up to 2 MB.</p>
      )}
    </div>
  )
}

export default CoverImageField