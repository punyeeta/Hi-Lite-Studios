import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
import type { BlogStory } from '@/supabase/supabase_services/Blogs_Stories/Blogs_stories'
import {
  fetchAllBlogStoriesForAdmin,
  fetchBlogStoryById,
  createBlogStory,
  updateBlogStory,
  deleteBlogStory,
  pinBlogStory,
  unpinBlogStory,
  uploadBlogImage,
} from '@/supabase/supabase_services/Blogs_Stories/Blogs_stories'
import { useMagazine } from '@/context/MagazineContext'
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
  const { refreshItems } = useMagazine()
  const [mode, setMode] = useState<Mode>('list')
  const [stories, setStories] = useState<BlogStory[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [selectedStory, setSelectedStory] = useState<BlogStory | null>(null)
  const [form, setForm] = useState<BlogFormState>(emptyForm)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingBodyImage, setUploadingBodyImage] = useState(false)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchAllBlogStoriesForAdmin()
        if (!cancelled) setStories(data)
      } catch (err: any) {
        if (!cancelled) setError(err.message ?? 'Failed to load stories')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

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

  const handleNewStory = () => {
    resetForm()
    setMode('create')
  }

  const handleEditStory = async (story: BlogStory) => {
    // If content is empty (from lightweight query), fetch full content
    if (!story.content) {
      setLoading(true)
      try {
        const fullStory = await fetchBlogStoryById(story.id)
        setSelectedStory(fullStory)
        setForm({
          title: fullStory.title,
          slug: fullStory.slug,
          cover_image: fullStory.cover_image ?? '',
          excerpt: fullStory.excerpt ?? '',
          content: fullStory.content,
          is_pinned: fullStory.is_pinned,
          status: fullStory.status,
        })
        setMode('edit')
      } catch (err: any) {
        setError(err.message ?? 'Failed to load story')
      } finally {
        setLoading(false)
      }
    } else {
      // Content already available
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
    }
  }

  const handleDeleteStory = async (story: BlogStory) => {
    if (!window.confirm('Delete this post? This action cannot be undone.'))
      return

    try {
      setSaving(true)
      await deleteBlogStory(story.id)
      setStories((prev) => prev.filter((s) => s.id !== story.id))
      // Refresh the magazine context so the UI updates immediately
      await refreshItems()
      if (selectedStory?.id === story.id) {
        resetForm()
        setMode('list')
      }
    } catch (err: any) {
      setError(err.message ?? 'Failed to delete story')
    } finally {
      setSaving(false)
    }
  }

  const handlePinToggle = async (story: BlogStory) => {
    try {
      setSaving(true)
      const updated = story.is_pinned
        ? await unpinBlogStory(story.id)
        : await pinBlogStory(story.id)

      setStories((prev) =>
        prev.map((s) => (s.id === story.id ? updated : s)),
      )
      // Refresh the magazine context so the UI updates immediately
      await refreshItems()
    } catch (err: any) {
      setError(err.message ?? 'Failed to update pin state')
    } finally {
      setSaving(false)
    }
  }

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

    setError(null)
    setUploadingCover(true)
    try {
      const { publicUrl } = await uploadBlogImage(file, 'covers')
      setForm((prev) => ({ ...prev, cover_image: publicUrl }))
    } catch (err: any) {
      setError(err.message ?? 'Failed to upload cover image')
    } finally {
      setUploadingCover(false)
      e.target.value = ''
    }
  }

  const handleBodyImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
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
      setError(err.message ?? 'Failed to upload image for content')
    } finally {
      setUploadingBodyImage(false)
      e.target.value = ''
    }
  }

  const handleSave = async () => {
    const title = form.title.trim()
    const content = form.content.trim()

    if (!title) {
      setError('Title is required')
      return
    }
    if (!content) {
      setError('Content is required')
      return
    }

    const generatedSlug = slugify(title)
    const plainText = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    const excerpt =
      plainText.length > 220 ? `${plainText.slice(0, 220).trimEnd()}...` : plainText

    setError(null)
    setSaving(true)

    try {
      if (mode === 'create') {
        const created = await createBlogStory({
          title,
          slug: generatedSlug,
          cover_image: form.cover_image.trim() || null,
          excerpt,
          content,
          is_pinned: form.is_pinned,
          status: form.status,
        })
        setStories((prev) => [created, ...prev])
        // Refresh the magazine context so the UI updates immediately
        await refreshItems()
        resetForm()
        setMode('list')
      } else if (mode === 'edit' && selectedStory) {
        const updated = await updateBlogStory(selectedStory.id, {
          title,
          slug: generatedSlug,
          cover_image: form.cover_image.trim() || null,
          excerpt,
          content,
          is_pinned: form.is_pinned,
          status: form.status,
        })
        setStories((prev) =>
          prev.map((s) => (s.id === updated.id ? updated : s)),
        )
        // Refresh the magazine context so the UI updates immediately
        await refreshItems()
        setSelectedStory(updated)
        setMode('list')
      }
    } catch (err: any) {
      setError(err.message ?? 'Failed to save story')
    } finally {
      setSaving(false)
    }
  }

  const handleCancelEdit = () => {
    resetForm()
    setMode('list')
  }

  const handleDeleteCurrentFromEditor = async () => {
    if (!selectedStory) return
    await handleDeleteStory(selectedStory)
  }

  const isEditing = mode === 'edit' || mode === 'create'

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <p className="text-md font-medium text-[#D42724]">Welcome, Admin.</p>
        <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
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
        />
      )}

      {error && isEditing && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
    </section>
  )
}