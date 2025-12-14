import type { Work } from '@/supabase/supabase_services/Content_Management/WorksCollection_Service/WorksCollection'
import { COLORS } from '../constants'

interface WorkCardProps {
  work: Work
  onEdit: (work: Work) => void
}

export default function WorkCard({ work, onEdit }: WorkCardProps) {
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
        
        {/* Draft Badge - Top Right */}
        {work.status === 'draft' && (
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-block rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-md" style={{ backgroundColor: COLORS.PRIMARY_RED }}>
              Draft
            </span>
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
            className="rounded-full px-6 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-md hover:scale-105"
            style={{ backgroundColor: COLORS.PRIMARY_RED }}
          >
            Edit
          </button>
        </div>
      </div>

      {/* Title Display - Below Image */}
      {work.title && (
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {work.title}
          </h3>
          {/* Published Date */}
          {work.date && (
            <p className="mt-1 text-xs text-gray-600">
              {new Date(work.date as unknown as string).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>
          )}
        </div>
      )}
    </article>
  )
}
