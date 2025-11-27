import { useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar } from '@/components/ui/calendar'
import {
  createWork,
  addWorkMedia,
  uploadWorkImage,
  type WorkLabel,
} from '@/supabase/supabase_services/Content_Management/WorksCollection_Service/WorksCollection'

const LABEL_OPTIONS: { value: WorkLabel; label: string }[] = [
  { value: 'Indoor & Studio', label: 'Indoor & Studio' },
  { value: 'Outdoor & Events', label: 'Outdoor & Events' },
  { value: 'Videography', label: 'Videography' },
]

interface MediaItem {
  id: string
  image_url: string
  file?: File
}

export default function AddNewProject() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    main_image_url: '',
    description: '',
    label_1: '' as WorkLabel | '',
    label_2: '' as WorkLabel | '',
    date: null as Date | null,
  })
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingMedia, setUploadingMedia] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (field: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setError(null)
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
      const newMediaItems: MediaItem[] = []
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const { publicUrl } = await uploadWorkImage(file, 'gallery')
        newMediaItems.push({
          id: `temp-${Date.now()}-${i}`,
          image_url: publicUrl,
        })
      }

      setMediaItems((prev) => [...prev, ...newMediaItems])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload media')
    } finally {
      setUploadingMedia(false)
      e.target.value = ''
    }
  }

  const handleDeleteMedia = async (mediaId: string) => {
    setMediaItems((prev) => prev.filter((item) => item.id !== mediaId))
  }

  const handleSave = async () => {
    if (!form.main_image_url) {
      setError('Please upload a cover image')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const workData = {
        main_image_url: form.main_image_url || null,
        description: form.description || null,
        label_1: (form.label_1 as WorkLabel) || null,
        label_2: (form.label_2 as WorkLabel) || null,
        date: form.date ? form.date.toISOString().split('T')[0] : null,
      }

      const newWork = await createWork(workData)

      // Add all media items to the database
      for (const item of mediaItems) {
        await addWorkMedia(newWork.id, item.image_url)
      }

      // Navigate back to works collection
      navigate('/admin/content', { state: { message: 'Project created successfully!' } })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save project')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate('/admin/content')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Add New Project</h1>
          <p className="mt-1 text-sm text-gray-500">Create a new work collection project</p>
        </div>
        <button
          type="button"
          onClick={handleCancel}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Main Form */}
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
                        alt="Cover"
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

          {/* Description and Fields Section */}
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

            <div className="grid grid-cols-2 gap-4">
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

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-800">LABEL</label>
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                value={form.label_2}
                onChange={(e) => handleChange('label_2', e.target.value as WorkLabel)}
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
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
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
            onClick={handleCancel}
            disabled={submitting}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Media Gallery Section */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Add Media</h2>
          <label className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50">
            <span>{uploadingMedia ? 'Uploading...' : 'Add Media'}</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleMediaUpload}
              className="hidden"
              disabled={uploadingMedia || submitting}
            />
          </label>
        </div>

        {mediaItems.length === 0 ? (
          <p className="text-sm text-gray-500">No media added yet. Click "Add Media" to upload images for the album.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {mediaItems.map((media) => (
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
                  className="absolute top-2 right-2 rounded-full bg-red-600 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-700"
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
  )
}

