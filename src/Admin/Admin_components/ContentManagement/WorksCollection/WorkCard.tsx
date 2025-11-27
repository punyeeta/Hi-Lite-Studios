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
      <div className="relative w-full bg-gray-100 flex items-center justify-center overflow-hidden" style={{ aspectRatio: '1 / 1' }}>
        {work.main_image_url ? (
          <img src={work.main_image_url} alt="Work" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-gray-400">
            No image
          </div>
        )}
        
        {/* Label - Bottom Left */}
        {work.label_1 && (
          <div className="absolute bottom-3 left-3 z-10">
            <span className="inline-block rounded-full bg-blue-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-blue-800 shadow-md">
              {work.label_1}
            </span>
          </div>
        )}
        
        {/* Edit Button - Bottom Right */}
        <div className="absolute bottom-3 right-3 z-10">
          <button
            type="button"
            onClick={() => onEdit(work)}
            className="rounded-full bg-[#291471] px-4 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-md hover:bg-[#1e0f55]"
          >
            Edit
          </button>
        </div>
      </div>
    </article>
  )
}
