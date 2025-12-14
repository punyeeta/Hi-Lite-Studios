import type { ChangeEvent } from 'react'
import ConfirmModal from '@/components/ui/ConfirmModal'
import { Calendar } from '@/components/ui/calendar'
import { ImageUploadField, MediaGallery, MediaUploadField } from '../../shared'
import { WORK_LABEL_OPTIONS } from '../../../../utils'
import { COLORS } from '../constants'
import StarBlack from '@/assets/images/StarBlack.png'
import type { WorkLabel, WorkMedia } from '@/supabase/supabase_services/Content_Management/WorksCollection_Service/WorksCollection'

interface WorksEditorViewProps {
  form: {
    main_image_url: string
    description: string
    label_1: WorkLabel | ''
    date: Date | null
    title: string
    status: 'draft' | 'published'
  }
  selectedWorkMedia: WorkMedia[]
  pendingMedia: { id: string; image_url: string }[]
  submitting?: boolean
  uploadingImage?: boolean
  uploadingMedia?: boolean
  error?: string | null
  success?: string | null
  onChangeField: (field: string, value: any) => void
  onMainImageUpload: (e: ChangeEvent<HTMLInputElement>) => Promise<void> | void
  onMediaUpload: (e: ChangeEvent<HTMLInputElement>) => Promise<void> | void
  onDeleteMedia: (mediaId: string) => Promise<void> | void
  onSave: () => Promise<void> | void
  onSaveDraft?: () => Promise<void> | void
  onCancel: () => void
  onDeleteCurrent?: () => void
  showDeleteModal?: boolean
  deleting?: boolean
  onConfirmDelete?: () => Promise<void> | void
  onCancelDelete?: () => void
}

export default function WorksEditorView({
  form,
  selectedWorkMedia,
  pendingMedia,
  submitting = false,
  uploadingImage = false,
  uploadingMedia = false,
  error,
  success,
  onChangeField,
  onMainImageUpload,
  onMediaUpload,
  onDeleteMedia,
  onSave,
  onSaveDraft,
  onCancel,
  onDeleteCurrent,
  showDeleteModal = false,
  deleting = false,
  onConfirmDelete,
  onCancelDelete,
}: WorksEditorViewProps) {
  // Ensure Calendar receives a Date object when `form.date` is a stored string
  const selectedDate = (() => {
    if (!form.date) return undefined
    if (form.date instanceof Date) return form.date
    // Convert YYYY-MM-DD to a Date at local midnight
    const str = form.date as unknown as string
    const [y, m, d] = str.split('-').map(Number)
    if (!y || !m || !d) return undefined
    return new Date(y, m - 1, d)
  })()
  return (
    <div className="space-y-1">
      {/* Top Action Bar - Delete & Cancel on Right */}
      <div className="flex items-center justify-end gap-3 mr-6">
        {onDeleteCurrent && (
          <button
            type="button"
            onClick={onDeleteCurrent}
            disabled={submitting || deleting}
            className="rounded-full border-2 border-red-500 px-4 py-2 text-sm font-semibold text-red-600 transition-all duration-200 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete project"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        )}
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting || deleting}
          className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:shadow-md hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        >
          Cancel
        </button>
      </div>
      
      {/* Success Message */}
      {success && (
        <div className="rounded-lg border border-green-300 bg-green-50 p-4 text-sm text-green-700">
          <p className="font-medium">✓ {success}</p>
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={deleting}
        onConfirm={onConfirmDelete || (() => {})}
        onCancel={onCancelDelete || (() => {})}
      />

      {/* Main Content Form */}
      <div className="rounded-xl bg-white p-6 space-y-6">
        {/* Image Section */}
        <ImageUploadField
          value={form.main_image_url}
          uploading={uploadingImage}
          submitting={submitting}
          onChange={onMainImageUpload}
          label="Upload Cover Image"
          changeButtonText="Change Image"
          buttonColor={COLORS.PRIMARY_PURPLE}
        />

        {/* Two-Column Layout */}
        <div className="grid gap-6 lg:grid-cols-[4fr_1.5fr] items-stretch">
          {/* Column 1: Description */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-800">DESCRIPTION</label>
            <textarea
              className="w-full h-[500px] rounded-lg border border-gray-300 px-4 py-3 text-sm 
                        focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100 resize-none"
              value={form.description}
              onChange={(e) => onChangeField('description', e.target.value)}
              placeholder="Enter description..."
              disabled={submitting || deleting}
            />
          </div>

          {/* Column 2: Calendar & Label */}
          <div className="flex flex-col w-full max-w-sm ml-auto space-y-3">
            {/* Calendar */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-800">DATE</label>
              <div className="rounded-2xl border border-[#dcdcdc] p-2 flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  defaultMonth={selectedDate}
                  onSelect={(date) => onChangeField('date', date || null)}
                  disabled={submitting || deleting}
                />
              </div>
            </div>

            {/* Label Selector */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-800">LABEL</label>
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm 
                          focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
                value={form.label_1}
                onChange={(e) => onChangeField('label_1', e.target.value as WorkLabel)}
                disabled={submitting || deleting}
              >
                <option value="">Select label...</option>
                {WORK_LABEL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Title Field */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-800">TITLE</label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm 
                          focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
                value={form.title}
                onChange={(e) => onChangeField('title', e.target.value)}
                placeholder="Enter title..."
                disabled={submitting || deleting}
              />
            </div>

            {/* Save Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => (onSaveDraft ? onSaveDraft() : undefined)}
                disabled={submitting || deleting}
                className="flex-1 rounded-full px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: COLORS.GRAY_GRADIENT }}
                title="Save as draft"
              >
                {submitting ? 'Saving...' : 'Save as Draft'}
              </button>
              <button
                type="button"
                onClick={onSave}
                disabled={submitting || deleting || !form.main_image_url}
                className="flex-1 rounded-full px-6 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{ backgroundColor: COLORS.PRIMARY_RED }}
              >
                {submitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>

        {/* Separator with Star Icon */}
        <div className="relative mt-16">
          <div className="h-0.5 w-full bg-black" />
          <img
            src={StarBlack}
            alt="star-black"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16"
          />
        </div>
      </div>

      {/* Media Gallery Section */}
      <div className="rounded-xl bg-white p-6 space-y-6 ">
        <div className="flex items-center justify-between">
          <MediaUploadField
            uploading={uploadingMedia}
            onUpload={onMediaUpload}
            buttonText={uploadingMedia ? 'Uploading...' : 'Add Media'}
          />
          <div />
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
