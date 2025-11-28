type WhatWeDoValues = {
  title: string
  description: string
}

import { COLORS } from '../../constants'

type WhatWeDoFormProps = {
  values: WhatWeDoValues
  submitting: boolean
  onChange: (changes: Partial<WhatWeDoValues>) => void
  onSubmit: () => void
  editing: boolean
  onEditToggle: () => void
  onCancel: () => void
}

export default function WhatWeDoForm({
  values,
  submitting,
  onChange,
  onSubmit,
  editing,
  onEditToggle,
  onCancel,
}: WhatWeDoFormProps) {
  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-end gap-4">
        <div className="flex flex-wrap gap-2">
          {editing ? (
            <>
              <button
                type="button"
                onClick={onSubmit}
                disabled={submitting}
                className="rounded-lg px-5 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-150 hover:shadow-lg hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
                style={{ backgroundColor: COLORS.PRIMARY_BLUE }}
              >
                {submitting ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                disabled={submitting}
                className="rounded-lg border border-gray-300 px-5 py-2 text-xs font-semibold text-gray-700 transition-all duration-150 hover:bg-gray-50 hover:shadow-sm disabled:opacity-50"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onEditToggle}
              className="rounded-lg px-5 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-150 hover:shadow-lg hover:scale-105"
              style={{ backgroundColor: COLORS.PRIMARY_RED }}
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Edit Form */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">TITLE</label>
          <input
            type="text"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            value={values.title}
            onChange={(e) => onChange({ title: e.target.value })}
            disabled={!editing || submitting}
            placeholder="Title"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">DESCRIPTION</label>
          <textarea
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            rows={6}
            value={values.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Describe your craft..."
            disabled={!editing || submitting}
          />
        </div>
      </div>
    </section>
  )
}

