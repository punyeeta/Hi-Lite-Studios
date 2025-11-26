import RichTextEditor from '@/components/common/RichTextEditor'
import type {
  BlogStatus,
} from '@/supabase/supabase_services/Blogs_Stories/Blogs_stories'
import type { ChangeEvent } from 'react'

export type Mode = 'list' | 'edit' | 'create'

export interface BlogFormState {
  title: string
  slug: string
  cover_image: string
  excerpt: string
  content: string
  is_pinned: boolean
  status: BlogStatus
}

interface BlogEditorViewProps {
  mode: Mode
  form: BlogFormState
  saving: boolean
  uploadingCover: boolean
  uploadingBodyImage: boolean
  onChangeField: (
    field: keyof BlogFormState,
  ) => (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => void
  onCoverUpload: (e: ChangeEvent<HTMLInputElement>) => Promise<void> | void
  onBodyImageUpload: (e: ChangeEvent<HTMLInputElement>) => Promise<void> | void
  onSave: () => Promise<void> | void
  onCancel: () => void
  onDeleteCurrent?: () => Promise<void> | void
}

export default function BlogEditorView({
  mode,
  form,
  saving,
  uploadingCover,
  uploadingBodyImage,
  onChangeField,
  onCoverUpload,
  onBodyImageUpload,
  onSave,
  onCancel,
  onDeleteCurrent,
}: BlogEditorViewProps) {
  return (
    <div className="mt-6 space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            {mode === 'create' ? 'New Post' : 'Editing Post'}
          </p>
          <h2 className="text-lg font-semibold text-gray-900">
            {mode === 'create' ? 'Create New Post' : form.title || 'Edit Post'}
          </h2>
        </div>
        {mode === 'edit' && onDeleteCurrent && (
          <button
            type="button"
            onClick={() => onDeleteCurrent()}
            className="rounded-full bg-[#F2322E] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm hover:bg-[#d51e1a]"
          >
            Delete Post
          </button>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr,3fr]">
        <div className="space-y-4">
          <div className="space-y-1 text-sm">
            <label className="font-medium text-gray-800">Cover image</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={form.cover_image}
                onChange={onChangeField('cover_image')}
                placeholder="https://.../blog-images/covers/post-1.jpg"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#291471] focus:outline-none focus:ring-1 focus:ring-[#291471]"
              />
              <label className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm hover:bg-black">
                <span>{uploadingCover ? 'Uploading...' : 'Upload'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onCoverUpload}
                  className="hidden"
                  disabled={uploadingCover}
                />
              </label>
            </div>
            <p className="text-xs text-gray-500">
              Upload a file to the <code>blog-images</code> bucket or paste an existing
              public URL.
            </p>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
            <div className="aspect-video w-full bg-gray-100 flex items-center justify-center">
              {form.cover_image ? (
                <img
                  src={form.cover_image}
                  alt={form.title || 'Cover preview'}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-gray-400">
                  Cover preview
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1 text-sm">
            <label className="font-medium text-gray-800">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={onChangeField('title')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#291471] focus:outline-none focus:ring-1 focus:ring-[#291471]"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <label className="font-medium text-gray-800">Content</label>
        <p className="text-xs text-gray-500">
          Use this area for the full article text. You can also insert images using the
          button below.
        </p>
        <div className="flex items-center justify-between pb-2 text-xs text-gray-500">
          <span>Article content</span>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1 font-medium hover:bg-gray-50">
            <span>
              {uploadingBodyImage ? 'Uploading image...' : 'Upload image for content'}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={onBodyImageUpload}
              className="hidden"
              disabled={uploadingBodyImage}
            />
          </label>
        </div>
        <div className="rounded-lg border border-gray-300 bg-white">
          <RichTextEditor
            value={form.content}
            onChange={(value) =>
              onChangeField('content')({
                target: { value, type: 'text' } as any,
              } as any)
            }
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-gray-300 bg-white px-5 py-2 text-xs font-semibold uppercase tracking-wide text-gray-700 hover:bg-gray-100"
        >
          Back to list
        </button>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="rounded-full bg-[#291471] px-6 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm hover:bg-[#1e0f55] disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {saving
              ? mode === 'create'
                ? 'Saving...'
                : 'Updating...'
              : mode === 'create'
              ? 'Save Post'
              : 'Update Post'}
          </button>
        </div>
      </div>
    </div>
  )
}


