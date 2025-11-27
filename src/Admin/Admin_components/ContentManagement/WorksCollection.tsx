import { useState, useEffect, type ChangeEvent } from 'react'
import { Calendar } from '@/components/ui/calendar'
import {
  fetchAllWorks,
  fetchWorkWithMedia,
  createWork,
  updateWork,
  deleteWork,
  addWorkMedia,
  deleteWorkMedia,
  uploadWorkImage,
  type Work,
  type WorkMedia,
  type WorkLabel,
} from '@/supabase/supabase_services/Content_Management/WorksCollection_Service/WorksCollection'

const LABEL_OPTIONS: { value: WorkLabel; label: string }[] = [
  { value: 'Indoor & Studio', label: 'Indoor & Studio' },
  { value: 'Outdoor & Events', label: 'Outdoor & Events' },
  { value: 'Videography', label: 'Videography' },
]

type Mode = 'list' | 'edit' | 'create'

const emptyForm = {
  main_image_url: '',
  description: '',
  label_1: '' as WorkLabel | '',
  date: null as Date | null,
}

export default function WorksCollection() {
  const [mode, setMode] = useState<Mode>('list')
  const [works, setWorks] = useState<Work[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [selectedWork, setSelectedWork] = useState<Work | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingMedia, setUploadingMedia] = useState(false)
  const [selectedWorkMedia, setSelectedWorkMedia] = useState<WorkMedia[]>([])
  const [selectedWorkId, setSelectedWorkId] = useState<string | null>(null)
  const [pendingMedia, setPendingMedia] = useState<{ id: string; image_url: string }[]>([])

  useEffect(() => {
    loadWorks()
  }, [])

  useEffect(() => {
    if (selectedWorkId) {
      loadWorkMedia(selectedWorkId)
    }
  }, [selectedWorkId])

  const loadWorks = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchAllWorks()
      setWorks(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load works')
    } finally {
      setLoading(false)
    }
  }

  const loadWorkMedia = async (workId: string) => {
    try {
      const workWithMedia = await fetchWorkWithMedia(workId)
      setSelectedWorkMedia(workWithMedia.media || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load media')
    }
  }

  const handleChange = (field: keyof typeof emptyForm, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setError(null)
  }

  const handleNewWork = () => {
    resetForm()
    setMode('create')
  }

  const handleEditWork = async (work: Work) => {
    setSelectedWork(work)
    setSelectedWorkId(work.id)
    setForm({
      main_image_url: work.main_image_url || '',
      description: work.description || '',
      label_1: (work.label_1 as WorkLabel) || '',
      date: work.date ? new Date(work.date) : null,
    })
    await loadWorkMedia(work.id)
    setMode('edit')
    setError(null)
  }

  const resetForm = () => {
    setSelectedWork(null)
    setSelectedWorkId(null)
    setSelectedWorkMedia([])
    setPendingMedia([])
    setForm(emptyForm)
    setError(null)
  }

  const handleCancelEdit = () => {
    resetForm()
    setMode('list')
  }

  const handleMainImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    setError(null)
    try {
      const { publicUrl } = await uploadWorkImage(file, 'main')
      setForm((prev) => ({ ...prev, main_image_url: publicUrl }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image')
    } finally {
      setUploadingImage(false)
      e.target.value = ''
    }
  }

  const handleMediaUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadingMedia(true)
    setError(null)
    try {
      const newMediaItems: { id: string; image_url: string }[] = []
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const { publicUrl } = await uploadWorkImage(file, 'gallery')
        newMediaItems.push({
          id: `temp-${Date.now()}-${i}`,
          image_url: publicUrl,
        })
      }

      if (selectedWorkId) {
        // Work already exists, add directly to database
        for (const item of newMediaItems) {
          await addWorkMedia(selectedWorkId, item.image_url)
        }
        await loadWorkMedia(selectedWorkId)
      } else {
        // Work doesn't exist yet, store temporarily
        setPendingMedia((prev) => [...prev, ...newMediaItems])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload media')
    } finally {
      setUploadingMedia(false)
      e.target.value = ''
    }
  }

  const handleDeleteMedia = async (mediaId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return

    try {
      if (mediaId.startsWith('temp-')) {
        // Delete from pending media
        setPendingMedia((prev) => prev.filter((item) => item.id !== mediaId))
      } else {
        // Delete from database
        await deleteWorkMedia(mediaId)
        if (selectedWorkId) {
          await loadWorkMedia(selectedWorkId)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete media')
    }
  }

  const handleSave = async () => {
    if (!form.main_image_url && !form.description) {
      setError('Please provide at least an image or description')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const workData = {
        main_image_url: form.main_image_url || null,
        description: form.description || null,
        label_1: (form.label_1 as WorkLabel) || null,
        label_2: null,
        date: form.date ? form.date.toISOString().split('T')[0] : null,
      }

      if (mode === 'edit' && selectedWork) {
        await updateWork(selectedWork.id, workData)
        await loadWorks()
        // Go back to list after saving
        resetForm()
        setMode('list')
      } else if (mode === 'create') {
        const newWork = await createWork(workData)
        
        // Add all pending media items to the database
        for (const item of pendingMedia) {
          await addWorkMedia(newWork.id, item.image_url)
        }
        
        await loadWorks()
        // Clear form and go back to list
        resetForm()
        setPendingMedia([])
        setMode('list')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save work')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (work: Work) => {
    if (!confirm('Are you sure you want to delete this work? This will also delete all associated media.'))
      return

    try {
      setSubmitting(true)
      await deleteWork(work.id)
      setWorks((prev) => prev.filter((w) => w.id !== work.id))
      if (selectedWork?.id === work.id) {
        resetForm()
        setMode('list')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete work')
    } finally {
      setSubmitting(false)
    }
  }

  const isEditing = mode === 'edit' || mode === 'create'

  const renderWorkCard = (work: Work) => (
    <article
      key={work.id}
      className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
    >
      <div className="relative aspect-4/3 w-full bg-gray-100">
        {work.main_image_url ? (
          <img
            src={work.main_image_url}
            alt="Work"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-gray-400">
            No image
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1">
          {work.label_1 && (
            <span className="inline-block rounded-full bg-blue-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-blue-800">
              {work.label_1}
            </span>
          )}
          {work.date && (
            <p className="text-[11px] uppercase tracking-wide text-gray-400">
              {new Date(work.date).toLocaleDateString()}
            </p>
          )}
        </div>

        <p className="line-clamp-3 text-xs text-gray-600">
          {work.description || 'No description yet.'}
        </p>

        <div className="mt-auto flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => handleEditWork(work)}
            className="rounded-full bg-[#291471] px-4 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm hover:bg-[#1e0f55]"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => handleDelete(work)}
            disabled={submitting}
            className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-600 shadow-sm hover:bg-gray-200 disabled:cursor-not-allowed"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  )

  return (
    <section className="space-y-6">
      {!isEditing && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleNewWork}
              className="rounded-full bg-[#291471] px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm hover:bg-[#1e0f55]"
            >
              Add New Project
            </button>

            {works.length > 0 && (
              <p className="text-xs text-gray-500">
                Showing <strong>{works.length}</strong> work{works.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading && !works.length ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <article
                  key={`skeleton-${index}`}
                  className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm animate-pulse"
                >
                  <div className="aspect-4/3 w-full bg-gray-300" />
                  <div className="flex flex-1 flex-col gap-3 p-4">
                    <div className="space-y-2">
                      <div className="h-5 w-3/4 rounded bg-gray-300" />
                      <div className="h-3 w-1/2 rounded bg-gray-200" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-full rounded bg-gray-200" />
                      <div className="h-3 w-5/6 rounded bg-gray-200" />
                    </div>
                    <div className="mt-auto flex items-center justify-end gap-2 pt-2">
                      <div className="h-7 w-16 rounded-full bg-gray-200" />
                      <div className="h-7 w-16 rounded-full bg-gray-200" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : works.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center text-sm text-gray-500">
              No works yet. Click <span className="font-semibold">Add New Project</span> to create your first work.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {works.map(renderWorkCard)}
            </div>
          )}
        </div>
      )}

      {isEditing && (
        <div className="space-y-8">
          {/* Error Message */}
          {error && (
            <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
              <p className="font-medium">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {/* Main Content Form */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
        <div className="grid gap-6 lg:grid-cols-[2fr,3fr]">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-800">Upload Cover Image</label>
              <div className="space-y-2">
                {form.main_image_url ? (
                  <div className="space-y-2">
                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                      <img
                        src={form.main_image_url}
                        alt="Main work"
                        className="h-64 w-full object-cover"
                      />
                    </div>
                    <label className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50">
                      <span>{uploadingImage ? 'Uploading...' : 'Change Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleMainImageUpload}
                        className="hidden"
                        disabled={uploadingImage || submitting}
                      />
                    </label>
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 hover:border-blue-400 hover:bg-blue-50 transition-colors">
                    <svg
                      className="mb-2 h-8 w-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <span className="text-sm font-medium text-gray-600">
                      {uploadingImage ? 'Uploading...' : 'Click to upload cover image'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageUpload}
                      className="hidden"
                      disabled={uploadingImage || submitting}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-800">DESCRIPTION</label>
              <textarea
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                rows={8}
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter description..."
                disabled={submitting}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-800">LABEL</label>
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                value={form.label_1}
                onChange={(e) => handleChange('label_1', e.target.value as WorkLabel)}
                disabled={submitting}
              >
                <option value="">Select label...</option>
                {LABEL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-800">Date</label>
              <div className="rounded-lg border border-gray-200">
                <Calendar
                  mode="single"
                  selected={form.date || undefined}
                  onSelect={(date) => handleChange('date', date || null)}
                  disabled={submitting}
                />
              </div>
            </div>
          </div>
        </div>

      </div>

          {/* Separator Line */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-gray-400">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </span>
            </div>
          </div>

          {/* Media Gallery Section */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <label className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-[#291471] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#1e0f55] disabled:opacity-50">
                <span>{uploadingMedia ? 'Uploading...' : 'Add Media'}</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleMediaUpload}
                  className="hidden"
                  disabled={uploadingMedia}
                />
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={submitting || !form.main_image_url}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={submitting}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>

            {selectedWorkMedia.length === 0 && pendingMedia.length === 0 ? (
              <p className="text-sm text-gray-500">No media added yet. Click "Add Media" to upload images.</p>
            ) : (
                <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {/* Show pending media (before work is created) */}
                  {pendingMedia.map((media) => (
                    <div key={media.id} className="relative group">
                      <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                        <img
                          src={media.image_url}
                          alt="Gallery"
                          className="h-48 w-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteMedia(media.id)}
                        className="absolute top-2 right-2 rounded-full bg-red-600 p-1.5 text-white hover:bg-red-700"
                        title="Delete"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                  {/* Show saved media (after work is created) */}
                  {selectedWorkMedia.map((media) => (
                    <div key={media.id} className="relative group">
                      <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                        <img
                          src={media.image_url}
                          alt="Gallery"
                          className="h-48 w-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteMedia(media.id)}
                        className="absolute top-2 right-2 rounded-full bg-red-600 p-1.5 text-white hover:bg-red-700"
                        title="Delete"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>
      )}
    </section>
  )
}

