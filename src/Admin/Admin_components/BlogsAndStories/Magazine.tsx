import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from 'react'
import ConfirmModal from '@/components/ui/ConfirmModal'
import type { BlogStory } from '@/supabase/supabase_services/Blogs_Stories/Blogs_stories'
import {
  uploadBlogImage,
} from '@/supabase/supabase_services/Blogs_Stories/Blogs_stories'
import { useAdminBlogStore } from '@/store/adminBlogStore'
import BlogListView from './BlogListView'
import BlogEditorView, {
  type BlogFormState,
  type Mode,
} from './BlogEditorView'

const emptyForm: BlogFormState = {
  title: '',
  slug: '',
  cover_image: '',
  excerpt: '',
  content: '',
  is_pinned: false,
  status: 'published',
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

export default function MagazineAdmin() {
  const { stories, loading, error, saving, fetchStories, fetchStoryById, createStory, updateStory, deleteStory, togglePin } = useAdminBlogStore()
  
  const [mode, setMode] = useState<Mode>('list')
  const [selectedStory, setSelectedStory] = useState<BlogStory | null>(null)
  const [form, setForm] = useState<BlogFormState>(emptyForm)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingBodyImage, setUploadingBodyImage] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  useEffect(() => {
    fetchStories()
  }, [fetchStories])

  const pinnedStories = useMemo(
    () => stories.filter((s) => s.is_pinned),
    [stories],
  )
  const otherStories = useMemo(
    () => stories.filter((s) => !s.is_pinned),
    [stories],
  )

  const resetForm = () => {
    setForm(emptyForm)
    setSelectedStory(null)
  }

  const handleNewStory = useCallback(() => {
    resetForm()
    setMode('create')
  }, [])

  const handleEditStory = useCallback(async (story: BlogStory) => {
    // Set mode immediately for instant UI feedback
    setSelectedStory(story)
    setForm({
      title: story.title,
      slug: story.slug,
      cover_image: story.cover_image ?? '',
      excerpt: story.excerpt ?? '',
      content: story.content,
      is_pinned: story.is_pinned,
      status: story.status,
    })
    setMode('edit')

    // If content is empty (from lightweight query), fetch full content with caching
    // This will use the cache if already fetched before
    if (!story.content) {
      const fullStory = await fetchStoryById(story.id)
      if (fullStory) {
        setSelectedStory(fullStory)
        setForm((prev) => ({
          ...prev,
          content: fullStory.content,
        }))
      }
    }
  }, [fetchStoryById])

  // Delete flow using ConfirmModal
  const [deleteTarget, setDeleteTarget] = useState<BlogStory | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDeleteStory = useCallback(async (story: BlogStory) => {
    setDeleteTarget(story)
    setShowDeleteModal(true)
  }, [])

  const handleDeleteConfirmed = useCallback(async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const success = await deleteStory(deleteTarget.id)
      if (success) {
        setSelectedStory((current) => current?.id === deleteTarget.id ? null : current)
        if (selectedStory?.id === deleteTarget.id) {
          resetForm()
          setMode('list')
        }
      }
    } finally {
      setDeleting(false)
      setShowDeleteModal(false)
      setDeleteTarget(null)
    }
  }, [deleteTarget, deleteStory, selectedStory])

  const handleDeleteCancel = useCallback(() => {
    setShowDeleteModal(false)
    setDeleteTarget(null)
  }, [])

  const handlePinToggle = useCallback(async (story: BlogStory) => {
    await togglePin(story.id, story.is_pinned)
  }, [togglePin])

  const handleChange =
    (field: keyof BlogFormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value =
        e.target.type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : (e.target as HTMLInputElement).value
      setForm((prev) => ({ ...prev, [field]: value as any }))
    }

  const handleCoverUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLocalError(null)
    setUploadingCover(true)
    try {
      const { publicUrl } = await uploadBlogImage(file, 'covers')
      setForm((prev) => ({ ...prev, cover_image: publicUrl }))
    } catch (err: any) {
      setLocalError(err.message ?? 'Failed to upload cover image')
    } finally {
      setUploadingCover(false)
      e.target.value = ''
    }
  }

  const handleBodyImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLocalError(null)
    setUploadingBodyImage(true)
    try {
      const { publicUrl } = await uploadBlogImage(file, 'body')
      setForm((prev) => ({
        ...prev,
        content:
          (prev.content ? `${prev.content}<p><br /></p>` : '') +
          `<p><img src="${publicUrl}" alt="" /></p>`,
      }))
    } catch (err: any) {
      setLocalError(err.message ?? 'Failed to upload image for content')
    } finally {
      setUploadingBodyImage(false)
      e.target.value = ''
    }
  }

  const handleSave = async () => {
    const title = form.title.trim()
    const content = form.content.trim()

    if (!title) {
      setLocalError('Title is required')
      return
    }
    if (!content) {
      setLocalError('Content is required')
      return
    }

    const generatedSlug = slugify(title)
    const plainText = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    const excerpt =
      plainText.length > 220 ? `${plainText.slice(0, 220).trimEnd()}...` : plainText

    setLocalError(null)

    try {
      if (mode === 'create') {
        const created = await createStory({
          title,
          slug: generatedSlug,
          cover_image: form.cover_image.trim() || null,
          excerpt,
          content,
          is_pinned: form.is_pinned,
          status: form.status,
        })
        if (created) {
          resetForm()
          setMode('list')
        }
      } else if (mode === 'edit' && selectedStory) {
        const updated = await updateStory(selectedStory.id, {
          title,
          slug: generatedSlug,
          cover_image: form.cover_image.trim() || null,
          excerpt,
          content,
          is_pinned: form.is_pinned,
          status: form.status,
        })
        if (updated) {
          setSelectedStory(updated)
          setMode('list')
        }
      }
    } catch (err: any) {
      setLocalError(err.message ?? 'Failed to save story')
    }
  }

  const handleCancelEdit = () => {
    resetForm()
    setMode('list')
  }

  const handleDeleteCurrentFromEditor = async () => {
    if (!selectedStory) return
    // open modal for the currently selected story
    setDeleteTarget(selectedStory)
    setShowDeleteModal(true)
  }

  const isEditing = mode === 'edit' || mode === 'create'

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
          Magazine Management
        </h1>
      </header>

      {!isEditing && (
        <BlogListView
          stories={stories}
          pinnedStories={pinnedStories}
          otherStories={otherStories}
          loading={loading}
          saving={saving}
          error={error}
          onNewStory={handleNewStory}
          onEditStory={handleEditStory}
          onDeleteStory={handleDeleteStory}
          onPinToggle={handlePinToggle}
        />
      )}

      {isEditing && (
        <BlogEditorView
          key={`${mode}-${selectedStory?.id || 'new'}`}
          mode={mode}
          form={form}
          saving={saving}
          uploadingCover={uploadingCover}
          uploadingBodyImage={uploadingBodyImage}
          onChangeField={handleChange}
          onCoverUpload={handleCoverUpload}
          onBodyImageUpload={handleBodyImageUpload}
          onSave={handleSave}
          onCancel={handleCancelEdit}
          onDeleteCurrent={mode === 'edit' ? handleDeleteCurrentFromEditor : undefined}
          selectedStoryId={selectedStory?.id}
        />
      )}

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete post"
        message="Delete this post? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={deleting}
        onConfirm={handleDeleteConfirmed}
        onCancel={handleDeleteCancel}
      />

      {error && !isEditing && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {localError && isEditing && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {localError}
        </div>
      )}
    </section>
  )
}