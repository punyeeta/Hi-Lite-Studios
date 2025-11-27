import type { ChangeEvent } from 'react'

interface MediaUploadFieldProps {
  loading?: boolean
  uploading?: boolean
  disabled?: boolean
  multiple?: boolean
  buttonText?: string
  onUpload: (e: ChangeEvent<HTMLInputElement>) => Promise<void> | void
}

export default function MediaUploadField({
  loading = false,
  uploading = false,
  disabled = false,
  multiple = true,
  buttonText = 'Upload Media',
  onUpload,
}: MediaUploadFieldProps) {
  const isDisabled = disabled || uploading || loading

  return (
    <label className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-[#291471] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#1e0f55] disabled:opacity-50">
      <span>{uploading ? 'Uploading...' : buttonText}</span>
      <input
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={onUpload}
        className="hidden"
        disabled={isDisabled}
      />
    </label>
  )
}
