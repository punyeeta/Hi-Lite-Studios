import { memo, type ChangeEvent } from 'react'
import RichTextEditor from '@/components/common/RichTextEditor'
import { AdminEngagementPanel } from './AdminEngagementPanel'
import { BLOG_COLORS } from './constants'
import type {
  BlogStatus,
} from '@/supabase/supabase_services/Blogs_Stories/Blogs_stories'

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
  onSaveDraft?: () => Promise<void> | void
  onCancel: () => void
  onDeleteCurrent?: () => Promise<void> | void
  selectedStoryId?: number
}

export default memo(function BlogEditorView({
  mode,
  form,
  saving,
  uploadingCover,
  uploadingBodyImage,
  onChangeField,
  onCoverUpload,
  onBodyImageUpload,
  onSave,
  onSaveDraft,
  onCancel,
  onDeleteCurrent,
  selectedStoryId,
}: BlogEditorViewProps) {
  return (
    <div className="mt-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            {mode === 'create' ? 'New Post' : 'Editing Post'}
          </p>
          <h2 className="text-lg font-semibold text-gray-900">
            {mode === 'create' ? 'Create New Post' : form.title || 'Edit Post'}
          </h2>
        </div>
        {mode === 'edit' && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-700 transition-all duration-150 hover:bg-gray-100 hover:shadow-sm hover:scale-105"
            >
              Back to list
            </button>
            {onDeleteCurrent && (
              <button
                type="button"
                onClick={() => onDeleteCurrent()}
                className="rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition-all duration-150 hover:shadow-lg hover:scale-105"
                style={{ background: BLOG_COLORS.RED_GRADIENT }}
              >
                Delete Post
              </button>
            )}
          </div>
        )}
        {mode === 'create' && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-700 transition-all duration-150 hover:bg-gray-100 hover:shadow-sm hover:scale-105"
            >
              Back to list
            </button>
          </div>
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
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[${BLOG_COLORS.PRIMARY_PURPLE}] focus:outline-none focus:ring-1 focus:ring-[${BLOG_COLORS.PRIMARY_PURPLE}]"
              />
              <label className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition-all duration-150 hover:bg-black hover:shadow-lg hover:scale-105">
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

          <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50 mx-auto max-w-xl w-full">
            <div className="aspect-video w-full bg-gray-100 flex items-center justify-center p-6">
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
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[${BLOG_COLORS.PRIMARY_PURPLE}] focus:outline-none focus:ring-1 focus:ring-[${BLOG_COLORS.PRIMARY_PURPLE}]"
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
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1 font-medium transition-all duration-150 hover:bg-gray-50 hover:shadow-sm hover:scale-105">
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
        <div className="rounded-lg border border-gray-300 bg-white relative overflow-visible">
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
          className="rounded-lg border border-gray-300 bg-white px-5 py-2 text-xs font-semibold uppercase tracking-wide text-gray-700 transition-all duration-150 hover:bg-gray-100 hover:shadow-sm hover:scale-105"
        >
          Back to list
        </button>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onSaveDraft ? onSaveDraft() : undefined}
            disabled={saving}
            title="Save as draft"
            className="rounded-lg px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition-all duration-200 hover:shadow-lg hover:scale-105 disabled:cursor-not-allowed"
            style={{ background: BLOG_COLORS.GRAY_GRADIENT }}
          >
            {saving ? 'Saving...' : 'Save as Draft'}
          </button>
          <button
            type="submit"
            onClick={onSave}
            disabled={saving}
            className={`rounded-lg px-6 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition-all duration-150 hover:shadow-lg hover:scale-105 disabled:cursor-not-allowed disabled:bg-gray-400`}
            style={{ backgroundColor: BLOG_COLORS.PRIMARY_PURPLE }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BLOG_COLORS.DARK_PURPLE)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BLOG_COLORS.PRIMARY_PURPLE)}
          >
            {saving
              ? 'Saving...'
              : mode === 'create'
              ? 'Publish Post'
              : 'Publish Changes'
            }
          </button>
        </div>
      </div>

      {/* Horizontal divider */}
      <div className="h-px bg-gray-300"></div>

      {/* Engagement Panel - Only show in edit mode */}
      {mode === 'edit' && selectedStoryId && (
        <AdminEngagementPanel blogStoryId={selectedStoryId} />
      )}
    </div>
  )
})


