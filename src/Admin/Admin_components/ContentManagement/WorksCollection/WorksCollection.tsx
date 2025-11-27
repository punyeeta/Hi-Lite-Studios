import { useState, useEffect, type ChangeEvent } from 'react'
import {
  fetchAllWorks,
  fetchWorkWithMedia,
  createWork,
  updateWork,
  deleteWork,
  addWorkMedia,
  deleteWorkMedia,
  uploadWorkImage,
  type Work,
  type WorkMedia,
  type WorkLabel,
} from '@/supabase/supabase_services/Content_Management/WorksCollection_Service/WorksCollection'
import WorksListView from './WorksListView'
import WorksEditorView from './WorksEditorView'

type Mode = 'list' | 'edit' | 'create'

const emptyForm = {
  main_image_url: '',
  description: '',
  label_1: '' as WorkLabel | '',
  date: null as Date | null,
}

export default function WorksCollection() {
  const [mode, setMode] = useState<Mode>('list')
  const [works, setWorks] = useState<Work[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [selectedWork, setSelectedWork] = useState<Work | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingMedia, setUploadingMedia] = useState(false)
  const [selectedWorkMedia, setSelectedWorkMedia] = useState<WorkMedia[]>([])
  const [selectedWorkId, setSelectedWorkId] = useState<string | null>(null)
  const [pendingMedia, setPendingMedia] = useState<{ id: string; image_url: string }[]>([])

  useEffect(() => {
    loadWorks()
  }, [])

  useEffect(() => {
    if (selectedWorkId) {
      loadWorkMedia(selectedWorkId)
    }
  }, [selectedWorkId])

  const loadWorks = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchAllWorks()
      setWorks(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load works')
    } finally {
      setLoading(false)
    }
  }

  const loadWorkMedia = async (workId: string) => {
    try {
      const workWithMedia = await fetchWorkWithMedia(workId)
      setSelectedWorkMedia(workWithMedia.media || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load media')
    }
  }

  const handleChange = (field: keyof typeof emptyForm, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setError(null)
  }

  const handleNewWork = () => {
    resetForm()
    setMode('create')
  }

  const handleEditWork = async (work: Work) => {
    setSelectedWork(work)
    setSelectedWorkId(work.id)
    setForm({
      main_image_url: work.main_image_url || '',
      description: work.description || '',
      label_1: (work.label_1 as WorkLabel) || '',
      date: work.date ? new Date(work.date) : null,
    })
    await loadWorkMedia(work.id)
    setMode('edit')
    setError(null)
  }

  const resetForm = () => {
    setSelectedWork(null)
    setSelectedWorkId(null)
    setSelectedWorkMedia([])
    setPendingMedia([])
    setForm(emptyForm)
    setError(null)
  }

  const handleCancelEdit = () => {
    resetForm()
    setMode('list')
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
      const newMediaItems: { id: string; image_url: string }[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const { publicUrl } = await uploadWorkImage(file, 'gallery')
        newMediaItems.push({
          id: `temp-${Date.now()}-${i}`,
          image_url: publicUrl,
        })
      }

      if (selectedWorkId) {
        // Work already exists, add directly to database
        for (const item of newMediaItems) {
          await addWorkMedia(selectedWorkId, item.image_url)
        }
        await loadWorkMedia(selectedWorkId)
      } else {
        // Work doesn't exist yet, store temporarily
        setPendingMedia((prev) => [...prev, ...newMediaItems])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload media')
    } finally {
      setUploadingMedia(false)
      e.target.value = ''
    }
  }

  const handleDeleteMedia = async (mediaId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return

    try {
      if (mediaId.startsWith('temp-')) {
        // Delete from pending media
        setPendingMedia((prev) => prev.filter((item) => item.id !== mediaId))
      } else {
        // Delete from database
        await deleteWorkMedia(mediaId)
        if (selectedWorkId) {
          await loadWorkMedia(selectedWorkId)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete media')
    }
  }

  const handleSave = async () => {
    if (!form.main_image_url && !form.description) {
      setError('Please provide at least an image or description')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const workData = {
        main_image_url: form.main_image_url || null,
        description: form.description || null,
        label_1: (form.label_1 as WorkLabel) || null,
        label_2: null,
        date: form.date ? form.date.toISOString().split('T')[0] : null,
      }

      if (mode === 'edit' && selectedWork) {
        await updateWork(selectedWork.id, workData)
        await loadWorks()
        // Go back to list after saving
        resetForm()
        setMode('list')
      } else if (mode === 'create') {
        const newWork = await createWork(workData)

        // Add all pending media items to the database
        for (const item of pendingMedia) {
          await addWorkMedia(newWork.id, item.image_url)
        }

        await loadWorks()
        // Clear form and go back to list
        resetForm()
        setPendingMedia([])
        setMode('list')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save work')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (work: Work) => {
    if (
      !confirm(
        'Are you sure you want to delete this work? This will also delete all associated media.',
      )
    )
      return

    try {
      setSubmitting(true)
      await deleteWork(work.id)
      setWorks((prev) => prev.filter((w) => w.id !== work.id))
      if (selectedWork?.id === work.id) {
        resetForm()
        setMode('list')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete work')
    } finally {
      setSubmitting(false)
    }
  }

  const isEditing = mode === 'edit' || mode === 'create'

  return (
    <section className="space-y-6">
      {!isEditing && (
        <WorksListView
          works={works}
          loading={loading}
          error={error}
          onNewWork={handleNewWork}
          onEditWork={handleEditWork}
          onDeleteWork={handleDelete}
          submitting={submitting}
        />
      )}

      {isEditing && (
        <WorksEditorView
          mode={mode}
          form={form}
          selectedWorkMedia={selectedWorkMedia}
          pendingMedia={pendingMedia}
          submitting={submitting}
          uploadingImage={uploadingImage}
          uploadingMedia={uploadingMedia}
          error={error}
          onChangeField={handleChange}
          onMainImageUpload={handleMainImageUpload}
          onMediaUpload={handleMediaUpload}
          onDeleteMedia={handleDeleteMedia}
          onSave={handleSave}
          onCancel={handleCancelEdit}
        />
      )}
    </section>
  )
}

