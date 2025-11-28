import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

type ConfirmModalProps = {
  isOpen: boolean
  title?: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  loading?: boolean
  onConfirm: () => Promise<void> | void
  onCancel: () => void
}

export default function ConfirmModal({
  isOpen,
  title = 'Confirm',
  message = 'Are you sure? This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const cancelRef = useRef<HTMLButtonElement | null>(null)
  const scrollYRef = useRef(0)

  useEffect(() => {
    if (!isOpen) return
    // Lock scroll
    scrollYRef.current = window.scrollY || window.pageYOffset
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollYRef.current}px`
    document.body.style.left = '0'
    document.body.style.right = '0'

    // focus cancel for easy escape
    setTimeout(() => cancelRef.current?.focus(), 0)

    return () => {
      // restore scroll and position
      const y = scrollYRef.current || 0
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      const docEl = document.documentElement
      const prev = docEl.style.scrollBehavior
      try {
        docEl.style.scrollBehavior = 'auto'
        window.scrollTo(0, y)
      } finally {
        docEl.style.scrollBehavior = prev
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative w-full max-w-2xl rounded-xl bg-white p-8 shadow-2xl mx-4">
        <h3 className="mb-3 text-2xl font-semibold">{title}</h3>
        <p className="mb-6 text-sm text-gray-600">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            ref={cancelRef}
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 transition-all duration-150 hover:bg-gray-50 disabled:opacity-50"
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => onConfirm()}
            className="rounded-lg px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:shadow-xl hover:scale-105 disabled:opacity-50"
            style={{ background: 'linear-gradient(to right, #F2322E 0%, #AA1815 100%)' }}
            disabled={loading}
          >
            {loading ? 'Working...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
