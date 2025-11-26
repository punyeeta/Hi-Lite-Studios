import { useState } from 'react'
import { useMagazine, type MagazineItem } from '@/context/MagazineContext'

const emptyForm: Omit<MagazineItem, 'id'> = {
  title: '',
  image: '',
  excerpt: '',
  content: '',
}

export default function AdminMagazine() {
  const { items, addItem, updateItem, deleteItem } = useMagazine()
  const [form, setForm] = useState<Omit<MagazineItem, 'id'>>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleChange = (field: keyof Omit<MagazineItem, 'id'>, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const startEdit = (item: MagazineItem) => {
    setEditingId(item.id)
    setForm({
      title: item.title,
      image: item.image,
      excerpt: item.excerpt,
      content: item.content,
    })
  }

  const resetForm = () => {
    setEditingId(null)
    setForm(emptyForm)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.image || !form.excerpt || !form.content) return

    if (editingId) {
      updateItem(editingId, form)
    } else {
      addItem(form)
    }
    resetForm()
  }

  return (
    <section className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Magazine Management</h1>
        <p className="text-sm text-gray-600">
          Create, edit, and remove magazine stories. Changes here are reflected in the public
          Magazine section.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="grid gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:grid-cols-[1.1fr,0.9fr]"
      >
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-800">Title</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-800">Image URL</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              value={form.image}
              onChange={(e) => handleChange('image', e.target.value)}
              placeholder="/magazine/example.jpg"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-800">Short Description</label>
            <textarea
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              rows={3}
              value={form.excerpt}
              onChange={(e) => handleChange('excerpt', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-800">Full Content</label>
            <textarea
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              rows={8}
              value={form.content}
              onChange={(e) => handleChange('content', e.target.value)}
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              {editingId ? 'Update Story' : 'Add Story'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Existing Stories</h2>
        {items.length === 0 ? (
          <p className="text-sm text-gray-500">No magazine stories yet.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <article
                key={item.id}
                className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-3">{item.excerpt}</p>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      className="rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-800 hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteItem(item.id)}
                      className="rounded-md border border-red-300 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  )
}


