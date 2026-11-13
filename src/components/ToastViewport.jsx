import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Toast from './ui/Toast'
import { removeToast, selectToasts } from '../features/toast/toastSlice'

function ToastViewport() {
  const dispatch = useDispatch()
  const toasts = useSelector(selectToasts)
  const dismiss = useCallback((id) => dispatch(removeToast(id)), [dispatch])

  return (
    // The container stays in the DOM, so screen readers pick up newly added toasts.
    // pointer-events-none lets clicks pass through the empty area around the toasts.
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4 sm:items-end"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={dismiss} />
      ))}
    </div>
  )
}

export default ToastViewport