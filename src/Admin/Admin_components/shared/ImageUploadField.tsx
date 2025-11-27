import type { ChangeEvent } from 'react'

interface ImageUploadFieldProps {
  value: string
  uploading?: boolean
  submitting?: boolean
  onChange: (e: ChangeEvent<HTMLInputElement>) => Promise<void> | void
  label?: string
  changeButtonText?: string
  uploadButtonText?: string
  alt?: string
}

export default function ImageUploadField({
  value,
  uploading = false,
  submitting = false,
  onChange,
  label = 'Upload Cover Image',
  changeButtonText = 'Change Image',
  uploadButtonText = 'Click to upload cover image',
  alt = 'Cover',
}: ImageUploadFieldProps) {
  const isDisabled = uploading || submitting

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-800">{label}</label>
      <div className="space-y-2">
        {value ? (
          <div className="space-y-2">
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
              <img src={value} alt={alt} className="h-64 w-full object-cover" />
            </div>
            <label className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50">
              <span>{uploading ? 'Uploading...' : changeButtonText}</span>
              <input
                type="file"
                accept="image/*"
                onChange={onChange}
                className="hidden"
                disabled={isDisabled}
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
              {uploading ? 'Uploading...' : uploadButtonText}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={onChange}
              className="hidden"
              disabled={isDisabled}
            />
          </label>
        )}
      </div>
    </div>
  )
}
