import type { ChangeEvent } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { ImageUploadField, MediaGallery, MediaUploadField } from '../../shared'
import { WORK_LABEL_OPTIONS } from '../../utils'
import type { Work, WorkLabel, WorkMedia } from '@/supabase/supabase_services/Content_Management/WorksCollection_Service/WorksCollection'

type Mode = 'create' | 'edit'

interface WorksEditorViewProps {
  mode: Mode
  form: {
    main_image_url: string
    description: string
    label_1: WorkLabel | ''
    date: Date | null
  }
  selectedWorkMedia: WorkMedia[]
  pendingMedia: { id: string; image_url: string }[]
  loading?: boolean
  submitting?: boolean
  uploadingImage?: boolean
  uploadingMedia?: boolean
  error?: string | null
  onChangeField: (field: string, value: any) => void
  onMainImageUpload: (e: ChangeEvent<HTMLInputElement>) => Promise<void> | void
  onMediaUpload: (e: ChangeEvent<HTMLInputElement>) => Promise<void> | void
  onDeleteMedia: (mediaId: string) => Promise<void> | void
  onSave: () => Promise<void> | void
  onCancel: () => void
}

export default function WorksEditorView({
  mode,
  form,
  selectedWorkMedia,
  pendingMedia,
  loading = false,
  submitting = false,
  uploadingImage = false,
  uploadingMedia = false,
  error,
  onChangeField,
  onMainImageUpload,
  onMediaUpload,
  onDeleteMedia,
  onSave,
  onCancel,
}: WorksEditorViewProps) {
  return (
    <div className="space-y-8">
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
          <ImageUploadField
            value={form.main_image_url}
            uploading={uploadingImage}
            submitting={submitting}
            onChange={onMainImageUpload}
            label="Upload Cover Image"
          />

          {/* Description Section */}
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-800">DESCRIPTION</label>
              <textarea
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                rows={8}
                value={form.description}
                onChange={(e) => onChangeField('description', e.target.value)}
                placeholder="Enter description..."
                disabled={submitting}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-800">LABEL</label>
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                value={form.label_1}
                onChange={(e) => onChangeField('label_1', e.target.value as WorkLabel)}
                disabled={submitting}
              >
                <option value="">Select label...</option>
                {WORK_LABEL_OPTIONS.map((opt) => (
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
                  onSelect={(date) => onChangeField('date', date || null)}
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
          <MediaUploadField
            uploading={uploadingMedia}
            onUpload={onMediaUpload}
            buttonText={uploadingMedia ? 'Uploading...' : 'Add Media'}
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onSave}
              disabled={submitting || !form.main_image_url}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>

        <MediaGallery
          media={[
            ...pendingMedia.map((m) => ({ id: m.id, image_url: m.image_url })),
            ...selectedWorkMedia,
          ]}
          uploading={uploadingMedia}
          onDelete={onDeleteMedia}
          emptyMessage="No media added yet. Click 'Add Media' to upload images."
        />
      </div>
    </div>
  )
}
