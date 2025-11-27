import type { Work } from '@/supabase/supabase_services/Content_Management/WorksCollection_Service/WorksCollection'

interface WorkCardProps {
  work: Work
  onEdit: (work: Work) => void
  onDelete: (work: Work) => void
  submitting?: boolean
}

export default function WorkCard({ work, onEdit, onDelete, submitting = false }: WorkCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="relative aspect-4/3 w-full bg-gray-100">
        {work.main_image_url ? (
          <img src={work.main_image_url} alt="Work" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-gray-400">
            No image
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1">
          {work.label_1 && (
            <span className="inline-block rounded-full bg-blue-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-blue-800">
              {work.label_1}
            </span>
          )}
          {work.date && (
            <p className="text-[11px] uppercase tracking-wide text-gray-400">
              {new Date(work.date).toLocaleDateString()}
            </p>
          )}
        </div>

        <p className="line-clamp-3 text-xs text-gray-600">
          {work.description || 'No description yet.'}
        </p>

        <div className="mt-auto flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => onEdit(work)}
            className="rounded-full bg-[#291471] px-4 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm hover:bg-[#1e0f55]"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(work)}
            disabled={submitting}
            className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-600 shadow-sm hover:bg-gray-200 disabled:cursor-not-allowed"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  )
}
