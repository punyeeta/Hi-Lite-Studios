import { useState } from 'react'
import { useFAQ, type FAQItem } from '@/context/FAQContext'
import FAQCard from '@/components/cards/FAQCards'

const emptyForm = {
  question: '',
  answer: '',
}

export default function AdminFAQ() {
  const { items, loading, error, addItem, updateItem, deleteItem } = useFAQ()
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleChange = (field: keyof typeof emptyForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setSubmitError(null)
  }

  const startEdit = (item: FAQItem) => {
    setEditingId(item.id)
    setForm({
      question: item.question,
      answer: item.answer,
    })
    setSubmitError(null)
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return

    try {
      await deleteItem(id)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to delete FAQ')
    }
  }

  return (
    <section className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">FAQ Management</h1>
        <p className="text-sm text-gray-600">
          Create, edit, and remove FAQ items. Changes here are reflected on the FAQ Page and Homepage
          section immediately.
        </p>
      </header>

      {/* Error Message */}
      {(error || submitError) && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-medium">Error:</p>
          <p>{error || submitError}</p>
        </div>
      )}

      {/* Form Section */}
      <form
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
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Saving...' : editingId ? 'Update FAQ' : 'Add FAQ'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              disabled={submitting}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                onDelete={handleDelete}
                className="bg-gray-50 border-gray-300"
              />
            ))}
          </div>
        )}
      </section>

      {/* Info Box */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
        <p className="font-medium mb-1">💡 Tips:</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>FAQs appear as a preview (first 3) on the homepage FAQ section</li>
          <li>All FAQs are available on the dedicated FAQ page</li>
          <li>Changes appear immediately for all users</li>
          <li>Keep answers clear, concise, and helpful</li>
        </ul>
      </div>
    </section>
  )
}
