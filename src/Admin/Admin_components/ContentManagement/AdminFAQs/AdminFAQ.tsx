import { useState, useRef } from 'react'
import ConfirmModal from '@/components/ui/ConfirmModal'
import { useFAQ, type FAQItem } from '@/components/sections/context/FAQContext'
import FAQCard from '@/components/cards/FAQCards'

const emptyForm = {
  question: '',
  answer: '',
}

export default function AdminFAQ() {
  const { items, loading, error, addItem, updateItem, deleteItem, refreshItems } = useFAQ()
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleChange = (field: keyof typeof emptyForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setSubmitError(null)
  }

  const formRef = useRef<HTMLFormElement | null>(null)

  const startEdit = (item: FAQItem) => {
    setEditingId(item.id)
    setForm({
      question: item.question,
      answer: item.answer,
    })
    setSubmitError(null)

    // Smooth scroll to the form and focus the first input
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      const el = formRef.current?.querySelector('input,textarea') as HTMLInputElement | HTMLTextAreaElement | null
      el?.focus()
    }, 100)
  }

  const resetForm = () => {
    setEditingId(null)
    setForm(emptyForm)
    setSubmitError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.question || !form.answer) return

    setSubmitting(true)
    setSubmitError(null)

    try {
      if (editingId) {
        await updateItem(editingId, form)
      } else {
        await addItem(form)
      }
      resetForm()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to save FAQ')
    } finally {
      setSubmitting(false)
    }
  }

  // Delete flow: open modal first, then confirm
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDeleteRequest = (id: string) => {
    setDeleteId(id)
    setShowDeleteModal(true)
  }

  // Ordering / featured helpers (persisted to localStorage)
  const getOrder = () => {
    try {
      const raw = localStorage.getItem('faq_order')
      return raw ? (JSON.parse(raw) as string[]) : items.map((i) => i.id)
    } catch {
      return items.map((i) => i.id)
    }
  }

  const saveOrder = (newOrder: string[]) => {
    try {
      localStorage.setItem('faq_order', JSON.stringify(newOrder))
    } catch {}
    refreshItems().catch(() => {})
  }

  const moveUp = (id: string) => {
    const order = getOrder()
    const idx = order.indexOf(id)
    if (idx > 0) {
      const copy = [...order]
      ;[copy[idx - 1], copy[idx]] = [copy[idx], copy[idx - 1]]
      saveOrder(copy)
    }
  }

  const moveDown = (id: string) => {
    const order = getOrder()
    const idx = order.indexOf(id)
    if (idx >= 0 && idx < order.length - 1) {
      const copy = [...order]
      ;[copy[idx], copy[idx + 1]] = [copy[idx + 1], copy[idx]]
      saveOrder(copy)
    }
  }

  const getFeatured = () => {
    try {
      const raw = localStorage.getItem('faq_featured')
      return raw ? (JSON.parse(raw) as string[]) : []
    } catch {
      return []
    }
  }

  const toggleFeatured = (id: string) => {
    const featured = getFeatured()
    const idx = featured.indexOf(id)
    const next = idx === -1 ? [...featured, id] : featured.filter((f) => f !== id)
    try {
      localStorage.setItem('faq_featured', JSON.stringify(next))
    } catch {}
    refreshItems().catch(() => {})
  }

  const handleDeleteConfirmed = async () => {
    if (!deleteId) return
    setDeleting(true)
    setSubmitError(null)
    try {
      await deleteItem(deleteId)
      setShowDeleteModal(false)
      setDeleteId(null)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to delete FAQ')
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
    setDeleteId(null)
  }

  // ConfirmModal handles scroll lock and restore internally

  return (
    <section className="space-y-8">
      {/* Error Message */}
      {(error || submitError) && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-medium">Error:</p>
          <p>{error || submitError}</p>
        </div>
      )}

      {/* Form Section */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-6"
      >
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-800">Question*</label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              value={form.question}
              onChange={(e) => handleChange('question', e.target.value)}
              placeholder="Enter the FAQ question..."
              required
              disabled={submitting}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-800">Answer*</label>
            <textarea
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              rows={6}
              value={form.answer}
              onChange={(e) => handleChange('answer', e.target.value)}
              placeholder="Enter the detailed answer..."
              required
              disabled={submitting}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#1E40AF' }}
          >
            {submitting ? 'Saving...' : editingId ? 'Update FAQ' : 'Add FAQ'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              disabled={submitting}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-all duration-150 hover:bg-gray-50 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* FAQ Items Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Existing FAQs ({items.length})</h2>
        {loading ? (
          <p className="text-sm text-gray-500">Loading FAQs...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-gray-500">No FAQ items yet. Create one to get started!</p>
        ) : (
          <div className="grid gap-4">
            {items.map((item) => (
              <FAQCard
                key={item.id}
                item={item}
                isAdmin={true}
                onEdit={startEdit}
                onDelete={handleDeleteRequest}
                onMoveUp={moveUp}
                onMoveDown={moveDown}
                onToggleFeatured={toggleFeatured}
                featured={getFeatured().includes(item.id)}
                className="bg-gray-50 border-gray-300"
              />
            ))}
          </div>
        )}
      </section>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Confirm delete"
        message="Are you sure you want to delete this FAQ? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={deleting}
        onConfirm={handleDeleteConfirmed}
        onCancel={handleDeleteCancel}
      />
    </section>
  )
}
