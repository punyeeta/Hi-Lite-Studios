import type { Work } from '@/supabase/supabase_services/Content_Management/WorksCollection_Service/WorksCollection'
import WorkCard from './WorkCard'

interface WorksListViewProps {
  works: Work[]
  loading: boolean
  error: string | null
  onNewWork: () => void
  onEditWork: (work: Work) => void
}

export default function WorksListView({
  works,
  loading,
  error,
  onNewWork,
  onEditWork,
}: WorksListViewProps) {
  // Use works array as-is - database already provides sorted order (by date, then created_at)
  // This prevents cards from reordering when dates are updated, since we preserve array position
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onNewWork}
          className="rounded-full bg-[#291471] px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm hover:bg-[#1e0f55]"
        >
          Add New Project
        </button>

        {works.length > 0 && (
          <p className="text-s text-[#333333]">
            Showing <strong>{works.length}</strong> work{works.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && !works.length ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <article
              key={`skeleton-${index}`}
              className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm animate-pulse"
            >
              <div className="aspect-4/3 w-full bg-gray-300" />
              <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="space-y-2">
                  <div className="h-5 w-3/4 rounded bg-gray-300" />
                  <div className="h-3 w-1/2 rounded bg-gray-200" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full rounded bg-gray-200" />
                  <div className="h-3 w-5/6 rounded bg-gray-200" />
                </div>
                <div className="mt-auto flex items-center justify-end gap-2 pt-2">
                  <div className="h-7 w-16 rounded-full bg-gray-200" />
                  <div className="h-7 w-16 rounded-full bg-gray-200" />
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : works.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center text-sm text-gray-500">
          No works yet. Click <span className="font-semibold">Add New Project</span> to create your first work.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          {works.map((work) => (
            <WorkCard
              key={work.id}
              work={work}
              onEdit={onEditWork}
            />
          ))}
        </div>
      )}
    </div>
  )
}
