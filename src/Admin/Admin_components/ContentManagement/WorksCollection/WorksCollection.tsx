import { useState, useEffect, type ChangeEvent } from 'react'
import {
  fetchAllWorks,
  fetchWorkWithMedia,
  createWork,
  updateWork,
  addWorkMedia,
  deleteWorkMedia,
  deleteWork,
  uploadWorkImage,
  type Work,
  type WorkMedia,
  type WorkLabel,
  type WorkStatus,
} from '@/supabase/supabase_services/Content_Management/WorksCollection_Service/WorksCollection'
import WorksListView from './WorksListView'
import WorksEditorView from './WorksEditorView'

type Mode = 'list' | 'edit' | 'create'

const emptyForm = {
  main_image_url: '',
  description: '',
  label_1: '' as WorkLabel | '',
  date: null as Date | null,
  title: '',
  status: 'draft' as WorkStatus,
}

export default function WorksCollection() {
  const [mode, setMode] = useState<Mode>('list')
  const [works, setWorks] = useState<Work[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [selectedWork, setSelectedWork] = useState<Work | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingMedia, setUploadingMedia] = useState(false)
  const [selectedWorkMedia, setSelectedWorkMedia] = useState<WorkMedia[]>([])
  const [selectedWorkId, setSelectedWorkId] = useState<string | null>(null)
  const [pendingMedia, setPendingMedia] = useState<{ id: string; image_url: string }[]>([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    loadWorks()
  }, [])

  // Don't use separate effect for selectedWorkId - handle in handler instead
  // This was causing double fetching on edit

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

  const handleChange = (field: keyof typeof emptyForm | string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setError(null)
    setSuccess(null)
  }

  const handleNewWork = () => {
    resetForm()
    setMode('create')
  }

  const handleEditWork = async (work: Work) => {
    setSelectedWork(work)
    setSelectedWorkId(work.id)
    // Parse date string as local date to avoid timezone issues
    let parsedDate: Date | null = null
    if (work.date) {
      const [year, month, day] = work.date.split('-').map(Number)
      if (year && month && day) {
        parsedDate = new Date(year, month - 1, day)
      }
    }
    setForm({
      main_image_url: work.main_image_url || '',
      description: work.description || '',
      label_1: (work.label_1 as WorkLabel) || '',
      date: parsedDate,
      title: work.title || '',
      status: work.status || 'draft',
    })
    // Load media immediately here instead of waiting for useEffect
    try {
      const workWithMedia = await fetchWorkWithMedia(work.id)
      setSelectedWorkMedia(workWithMedia.media || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load media')
    }
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

  const handleDeleteCurrent = () => {
    if (!selectedWork) return
    setShowDeleteModal(true)
  }

  const handleDeleteConfirmed = async () => {
    if (!selectedWork) return
    setDeleting(true)
    setError(null)

    try {
      await deleteWork(selectedWork.id)
      // Remove from local state
      setWorks((prev) => prev.filter((w) => w.id !== selectedWork.id))
      setSuccess('Work deleted successfully')
      setTimeout(() => setSuccess(null), 3000)
      resetForm()
      setMode('list')
    } catch (err) {
      console.error('[WorksCollection] Delete error:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete work')
    } finally {
      setDeleting(false)
      setShowDeleteModal(false)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
  }

  const handleSaveWork = async (status: WorkStatus) => {
    if (!form.main_image_url && !form.description) {
      setError('Please provide at least an image or description')
      return
    }

    setSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      // Format date as YYYY-MM-DD using local date components to avoid timezone issues
      let formattedDate: string | null = null
      if (form.date) {
        const year = form.date.getFullYear()
        const month = String(form.date.getMonth() + 1).padStart(2, '0')
        const day = String(form.date.getDate()).padStart(2, '0')
        formattedDate = `${year}-${month}-${day}`
      }
      
      const workData = {
        main_image_url: form.main_image_url || null,
        description: form.description || null,
        label_1: (form.label_1 as WorkLabel) || null,
        label_2: null,
        date: formattedDate,
        title: form.title || null,
        status,
      }

      if (mode === 'edit' && selectedWork) {
        const updated = await updateWork(selectedWork.id, workData)
        // ✅ Update local state instead of re-fetching
        setWorks((prev) =>
          prev.map((w) => (w.id === updated.id ? updated : w))
        )
        setSuccess(`Work ${status === 'draft' ? 'saved as draft' : 'published'}!`)
        setTimeout(() => setSuccess(null), 3000)
        resetForm()
        setMode('list')
      } else if (mode === 'create') {
        const newWork = await createWork(workData)
        // ✅ Add to local state instead of re-fetching
        setWorks((prev) => [newWork, ...prev])

        // Add all pending media items to the database
        for (const item of pendingMedia) {
          await addWorkMedia(newWork.id, item.image_url)
        }

        setSuccess(`Work ${status === 'draft' ? 'saved as draft' : 'published'}!`)
        setTimeout(() => setSuccess(null), 3000)
        resetForm()
        setMode('list')
      }
    } catch (err) {
      console.error('[WorksCollection] Save error:', err)
      setError(err instanceof Error ? err.message : 'Failed to save work')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSave = async () => {
    await handleSaveWork('published')
  }

  const handleSaveDraft = async () => {
    await handleSaveWork('draft')
  }

  // Kept for potential future use in delete functionality

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
        />
      )}

      {isEditing && (
        <WorksEditorView
          form={form}
          selectedWorkMedia={selectedWorkMedia}
          pendingMedia={pendingMedia}
          submitting={submitting}
          uploadingImage={uploadingImage}
          uploadingMedia={uploadingMedia}
          error={error}
          success={success}
          onChangeField={handleChange}
          onMainImageUpload={handleMainImageUpload}
          onMediaUpload={handleMediaUpload}
          onDeleteMedia={handleDeleteMedia}
          onSave={handleSave}
          onSaveDraft={handleSaveDraft}
          onCancel={handleCancelEdit}
          onDeleteCurrent={mode === 'edit' ? handleDeleteCurrent : undefined}
          showDeleteModal={showDeleteModal}
          deleting={deleting}
          onConfirmDelete={handleDeleteConfirmed}
          onCancelDelete={handleDeleteCancel}
        />
      )}
    </section>
  )
}

