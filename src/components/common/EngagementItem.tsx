import type { MagazineEngagement } from '@/supabase/supabase_services/Blogs_Stories/reactions_comments'

const EMOJI_MAP = {
  smile: '😊',
  surprised: '😮',
  sad: '😔',
  love: '😍',
  shocked: '😱',
}

interface EngagementItemProps {
  engagement: MagazineEngagement
  onDelete?: (engagementId: number) => void
  onEdit?: (engagement: MagazineEngagement) => void
  isAdmin?: boolean
}

export const EngagementItem = ({
  engagement,
  onDelete,
  onEdit,
  isAdmin = false,
}: EngagementItemProps) => {
  const formattedDate = new Date(engagement.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className="flex gap-6 py-4">
      {/* Emoji - Left */}
      <div className="shrink-0">
        <div className="w-16 h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center text-3xl shadow-xl">
          {EMOJI_MAP[engagement.reaction_type as keyof typeof EMOJI_MAP]}
        </div>
      </div>

      {/* Content - Middle/Right */}
      <div className="flex-1 min-w-0">
        <div className="bg-white border-2 border-gray-300 rounded-2xl p-5 shadow-sm">
          <p className="text-base text-gray-800 leading-relaxed wrap-break-word">
            {engagement.content}
          </p>
        </div>
        {/* Date - Below content, right aligned */}
        <p className="text-sm text-gray-500 mt-3 text-right">{formattedDate}</p>
      </div>

      {/* Admin Actions */}
      {isAdmin && (
        <div className="flex gap-2 shrink-0 self-start">
          {onEdit && (
            <button
              onClick={() => onEdit(engagement)}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition shadow-sm"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(engagement.id)}
              className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition shadow-sm"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  )
}
