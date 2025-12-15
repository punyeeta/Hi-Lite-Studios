import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import ConfirmModal from '@/components/ui/ConfirmModal'
export interface MediaItem {
  id: string
  image_url: string
}

interface MediaGalleryProps {
  media: MediaItem[]
  uploading?: boolean
  onDelete?: (mediaId: string) => Promise<void> | void
  onReorder?: (mediaIds: string[]) => Promise<void> | void
  emptyMessage?: string
  columns?: number
  editMode?: boolean
  onEditModeChange?: (editing: boolean) => void
}

export default function MediaGallery({
  media,
  uploading = false,
  onDelete,
  onReorder,
  emptyMessage = 'No media added yet.',
  columns = 4,
  editMode: externalEditMode,
  onEditModeChange,
}: MediaGalleryProps) {
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [editMode, setEditMode] = useState(!!externalEditMode)
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)
  // Sync with external edit mode if provided
  const prevExternal = useRef<boolean | undefined>(externalEditMode)
  if (prevExternal.current !== externalEditMode && externalEditMode !== undefined) {
    prevExternal.current = externalEditMode
    setEditMode(!!externalEditMode)
  }
  const [order, setOrder] = useState(() => media.map(m => m.id))
  const holdTimer = useRef<number | null>(null)
  const dragId = useRef<string | null>(null)
  const prevMediaRef = useRef<string>('')
  const isSavingRef = useRef<boolean>(false)
  const saveDebounceTimer = useRef<number | null>(null)

  // Reset order when media changes (but not while editing/saving)
  useEffect(() => {
    if (editMode || isSavingRef.current) return
    const currentMediaIds = media.map(m => m.id).join(',')
    const currentMediaIdsArray = media.map(m => m.id)
    if (prevMediaRef.current !== currentMediaIds) {
      const mediaIdsSet = new Set(currentMediaIdsArray)
      const orderIdsSet = new Set(order)
      const hasSameIds = mediaIdsSet.size === orderIdsSet.size &&
        [...mediaIdsSet].every(id => orderIdsSet.has(id))
      if (hasSameIds && prevMediaRef.current !== '') {
        prevMediaRef.current = currentMediaIds
        return
      } else {
        setOrder(currentMediaIdsArray)
        prevMediaRef.current = currentMediaIds
      }
    }
  }, [media, editMode])

  // Freeze background and keyboard navigation while preview is open
  useEffect(() => {
    if (previewIndex === null) return
    const body = document.body
    const scrollY = window.scrollY
    const prev = { position: body.style.position, top: body.style.top, width: body.style.width, overflow: body.style.overflow }
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.width = '100%'
    body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPreviewIndex(null)
      } else if (e.key === 'ArrowRight') {
        setPreviewIndex((prev) => {
          if (prev === null) return prev
          return (prev + 1) % orderedMedia.length
        })
      } else if (e.key === 'ArrowLeft') {
        setPreviewIndex((prev) => {
          if (prev === null) return prev
          return (prev - 1 + orderedMedia.length) % orderedMedia.length
        })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      body.style.position = prev.position
      body.style.top = prev.top
      body.style.width = prev.width
      body.style.overflow = prev.overflow
      window.scrollTo(0, scrollY)
    }
  }, [previewIndex])

  const orderedMedia = useMemo(() => {
    const map = new Map(media.map(m => [m.id, m]))
    return order.map(id => map.get(id)).filter(Boolean) as MediaItem[]
  }, [media, order])

  const startHold = useCallback(() => {
    if (holdTimer.current) window.clearTimeout(holdTimer.current)
    holdTimer.current = window.setTimeout(() => {
      setEditMode(true)
      if (onEditModeChange) onEditModeChange(true)
    }, 500)
  }, [])

  const cancelHold = useCallback(() => {
    if (holdTimer.current) {
      window.clearTimeout(holdTimer.current)
      holdTimer.current = null
    }
  }, [])

  const debouncedSave = useCallback(() => {
    if (saveDebounceTimer.current) {
      window.clearTimeout(saveDebounceTimer.current)
    }
    saveDebounceTimer.current = window.setTimeout(async () => {
      if (onReorder && order.length > 0 && editMode) {
        isSavingRef.current = true
        try {
          await onReorder([...order])
          setTimeout(() => { isSavingRef.current = false }, 500)
        } catch (err) {
          isSavingRef.current = false
          console.error('[MediaGallery] Error saving order:', err)
        }
      }
    }, 800)
  }, [onReorder, order, editMode])

  const prevEdit = useRef<boolean>(editMode)
  useEffect(() => {
    const wasEditing = prevEdit.current
    const isEditing = editMode
    if (wasEditing !== isEditing) {
      prevEdit.current = isEditing
      if (onEditModeChange) onEditModeChange(isEditing)
      if (wasEditing && !isEditing && onReorder && order.length > 0) {
        if (saveDebounceTimer.current) {
          window.clearTimeout(saveDebounceTimer.current)
          saveDebounceTimer.current = null
        }
        isSavingRef.current = true
        setTimeout(async () => {
          try {
            await onReorder([...order])
            setTimeout(() => { isSavingRef.current = false }, 500)
          } catch (err) {
            isSavingRef.current = false
            console.error('[MediaGallery] Error saving order:', err)
          }
        }, 0)
      }
    }
  }, [editMode, onEditModeChange, onReorder, order])

  const onDragStart = (id: string) => { dragId.current = id }
  const onDragOver = (e: React.DragEvent<HTMLDivElement>, overId: string) => {
    e.preventDefault()
    const from = dragId.current
    if (!from || from === overId) return
    const newOrder = [...order]
    const fromIdx = newOrder.indexOf(from)
    const overIdx = newOrder.indexOf(overId)
    if (fromIdx === -1 || overIdx === -1) return
    newOrder.splice(fromIdx, 1)
    newOrder.splice(overIdx, 0, from)
    setOrder(newOrder)
  }
  const onDragEnd = () => { dragId.current = null; debouncedSave() }

  const handleDelete = async (mediaId: string) => { if (!onDelete) return; setDeleteTargetId(mediaId) }

  if (media.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-8 text-center">
        <p className="text-sm text-gray-500">{emptyMessage}</p>
      </div>
    )
  }
  const isVideo = (url: string) => /\.(mp4|webm|ogg|mov|m4v)$/i.test(url)

  return (
    <>
      <style>{`
        @keyframes media-shake { 0% { transform: rotate(-1.2deg) } 50% { transform: rotate(1.2deg) } 100% { transform: rotate(-1.2deg) } }
      `}</style>
      <div className={`grid gap-4 md:grid-cols-3 lg:grid-cols-${columns}`}>
        {orderedMedia.map((item) => (
          <div
            key={item.id}
            className={`relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50 ${editMode ? 'cursor-move' : ''}`}
            draggable={editMode}
            onDragStart={() => onDragStart(item.id)}
            onDragOver={(e) => onDragOver(e, item.id)}
            onDragEnd={onDragEnd}
            onPointerDown={startHold}
            onPointerUp={cancelHold}
            onPointerLeave={cancelHold}
            onClick={() => {
              if (editMode) return
              const idx = orderedMedia.findIndex(m => m.id === item.id)
              setPreviewIndex(idx >= 0 ? idx : 0)
            }}
            style={editMode ? { animation: 'media-shake 0.4s linear infinite' } : undefined}
          >
            {isVideo(item.image_url) ? (
              <div className="relative">
                <video src={item.image_url} className="h-48 w-full object-cover bg-black" muted playsInline preload="metadata" />
                <div className="pointer-events-none absolute inset-0 grid place-items-center">
                  <div className="h-10 w-10 rounded-full bg-black/50 text-white grid place-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                </div>
              </div>
            ) : (
              <img src={item.image_url} alt="Gallery item" className="h-48 w-full object-cover" />
            )}
            {onDelete && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleDelete(item.id) }}
                disabled={uploading}
                className="absolute right-2 top-2 rounded-full bg-red-600 p-1.5 text-white hover:bg-red-700 disabled:cursor-not-allowed"
                title="Delete"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a 1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={!!deleteTargetId}
        title="Delete Media"
        message="Are you sure you want to delete this media? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={uploading}
        onConfirm={async () => { if (!onDelete || !deleteTargetId) return; await onDelete(deleteTargetId); setDeleteTargetId(null) }}
        onCancel={() => setDeleteTargetId(null)}
      />

      {/* Lightbox overlay (matches user gallery) via portal to escape transformed ancestors */}
      {previewIndex !== null && orderedMedia[previewIndex] && createPortal(
        <div
          className="fixed inset-0 z-1000 bg-black/80 flex items-center justify-center p-4 touch-none"
          onClick={() => setPreviewIndex(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative flex items-center justify-center w-full h-full">
            {/* Prev */}
            <button
              type="button"
              aria-label="Previous"
              className="absolute top-1/2 -translate-y-1/2 left-6 md:left-10 flex items-center justify-center leading-none rounded-full bg-white/80 text-black px-3 py-2 pt-px text-3xl font-semibold shadow-lg hover:bg-white"
              onClick={(e) => {
                e.stopPropagation()
                setPreviewIndex((prev) => {
                  if (prev === null) return prev
                  return (prev - 1 + orderedMedia.length) % orderedMedia.length
                })
              }}
            >
              ‹
            </button>

            {(() => {
              const url = orderedMedia[previewIndex].image_url
              if (isVideo(url)) {
                return (
                  <video
                    src={url}
                    className="max-w-[95vw] max-h-[90vh] object-contain rounded-lg shadow-2xl bg-black"
                    controls
                    autoPlay
                    playsInline
                    preload="auto"
                    onClick={(e) => e.stopPropagation()}
                  />
                )
              }
              return (
                <img
                  src={url}
                  alt="Full view"
                  className="max-w-[95vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                />
              )
            })()}

            {/* Next */}
            <button
              type="button"
              aria-label="Next"
              className="absolute top-1/2 -translate-y-1/2 right-6 md:right-10 flex items-center justify-center leading-none rounded-full bg-white/80 text-black px-3 py-2 pt-px text-3xl font-semibold shadow-lg hover:bg-white"
              onClick={(e) => {
                e.stopPropagation()
                setPreviewIndex((prev) => {
                  if (prev === null) return prev
                  return (prev + 1) % orderedMedia.length
                })
              }}
            >
              ›
            </button>
          </div>
          <button
            type="button"
            aria-label="Close"
            className="absolute top-4 right-4 rounded-full bg-white/90 text-black px-3 py-1 text-sm font-semibold shadow hover:bg-white"
            onClick={(e) => { e.stopPropagation(); setPreviewIndex(null) }}
          >
            Close
          </button>
        </div>,
        document.body
      )}
    </>
  )
}
