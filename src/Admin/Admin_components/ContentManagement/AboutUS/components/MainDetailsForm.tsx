import type { ChangeEvent } from 'react'

type MainDetailsValues = {
  main_image_url: string
  description: string
}

type MainDetailsFormProps = {
  values: MainDetailsValues
  onChange: (changes: Partial<MainDetailsValues>) => void
  onSubmit: () => void
  onImageUpload: (file: File) => void
  submitting: boolean
  uploadingImage: boolean
  editing: boolean
  onEditToggle: () => void
  onCancel: () => void
}

export default function MainDetailsForm({
  values,
  onChange,
  onSubmit,
  onImageUpload,
  submitting,
  uploadingImage,
  editing,
  onEditToggle,
  onCancel,
}: MainDetailsFormProps) {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onImageUpload(file)
      event.target.value = ''
    }
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-end gap-4">
        <div className="flex flex-wrap gap-2">
          {editing ? (
            <>
              <button
                type="button"
                onClick={onSubmit}
                disabled={submitting}
                className="rounded px-4 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                style={{ backgroundColor: '#1E40AF' }}
              >
                {submitting ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                disabled={submitting}
                className="rounded border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onEditToggle}
              className="rounded px-4 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-90"
              style={{ backgroundColor: '#1E40AF' }}
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Edit Form */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">MAIN IMAGE URL</label>
          <input
            type="text"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            value={values.main_image_url}
            onChange={(e) => onChange({ main_image_url: e.target.value })}
            placeholder="Paste image link..."
            disabled={!editing || submitting}
          />
          <label className="inline-flex cursor-pointer items-center justify-center rounded px-4 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: '#1E40AF' }}>
            <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={!editing || uploadingImage || submitting}
            />
          </label>
        </div>

        {values.main_image_url ? (
          <div className="overflow-hidden rounded border border-gray-200 bg-gray-50">
            <img src={values.main_image_url} alt="About Us" className="h-64 w-full object-cover" />
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center rounded border border-dashed border-gray-300 text-sm text-gray-400">
            No image selected yet.
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">DESCRIPTION</label>
          {editing ? (
            <textarea
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              rows={6}
              value={values.description}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder="Share your story..."
              disabled={submitting}
            />
          ) : (
            <p className="rounded border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
              {values.description || 'No description yet.'}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

