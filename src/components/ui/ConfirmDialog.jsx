import { useEffect, useRef } from 'react'
import Button from './Button'

function ConfirmDialog({ open, title, description, confirmLabel = 'Confirm', isLoading = false, onConfirm, onCancel }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  function cancel() {
    if (!isLoading) onCancel()
  }

  return (
    <dialog
      ref={dialogRef}
      onCancel={(event) => {
        event.preventDefault() // we close it ourselves through the `open` prop
        cancel()
      }}
      // A click on the dark backdrop targets the <dialog> element itself.
      onClick={(event) => event.target === dialogRef.current && cancel()}
      className="m-auto w-full max-w-md rounded-xl border border-slate-200 bg-white p-0 text-slate-900 shadow-xl backdrop:bg-slate-950/50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
    >
      <div className="p-6">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={cancel} disabled={isLoading}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Deleting...' : confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  )
}

export default ConfirmDialog