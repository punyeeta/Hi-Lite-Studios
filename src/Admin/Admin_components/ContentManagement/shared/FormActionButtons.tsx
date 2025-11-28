import { COLORS } from '../../ContentManagement/constants'

interface FormActionButtonsProps {
  editing: boolean
  submitting: boolean
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
  saveLabel?: string
  editLabel?: string
  cancelLabel?: string
}

/**
 * Reusable form action buttons component
 * Consolidates Edit/Save/Cancel button logic used across AboutUS forms
 */
export default function FormActionButtons({
  editing,
  submitting,
  onEdit,
  onSave,
  onCancel,
  saveLabel = 'Save',
  editLabel = 'Edit',
  cancelLabel = 'Cancel',
}: FormActionButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {editing ? (
        <>
          <button
            type="button"
            onClick={onSave}
            disabled={submitting}
            className="rounded-lg px-5 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-150 hover:shadow-lg hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
            style={{ backgroundColor: COLORS.PRIMARY_BLUE }}
          >
            {submitting ? 'Saving...' : saveLabel}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="rounded-lg border border-gray-300 px-5 py-2 text-xs font-semibold text-gray-700 transition-all duration-150 hover:bg-gray-50 hover:shadow-sm disabled:opacity-50"
          >
            {cancelLabel}
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={onEdit}
          className="rounded-lg px-5 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-150 hover:shadow-lg hover:scale-105"
          style={{ backgroundColor: COLORS.PRIMARY_RED }}
        >
          {editLabel}
        </button>
      )}
    </div>
  )
}
