import { useEffect, useState } from 'react'
import { useMagazineEngagement } from '@/utils/useMagazineEngagement'

const EMOJI_MAP = {
  smile: '😊',
  surprised: '😮',
  sad: '😔',
  love: '😍',
  shocked: '😱',
}

interface AdminEngagementPanelProps {
  blogStoryId?: number
}

export const AdminEngagementPanel = ({ blogStoryId }: AdminEngagementPanelProps) => {
  const [editingEngagementId, setEditingEngagementId] = useState<number | null>(null)
  const [editingContent, setEditingContent] = useState('')

  const engagement = useMagazineEngagement({
    blogStoryId: blogStoryId || 0,
  })

  useEffect(() => {
    if (blogStoryId) {
      engagement.loadEngagements()
    }
  }, [blogStoryId])

  if (!blogStoryId) {
    return null
  }

  const handleDeleteEngagement = async (engagementId: number) => {
    if (confirm('Delete this feedback?')) {
      await engagement.deleteEngagement(engagementId)
    }
  }

  const handleSaveEdit = async (engagementId: number) => {
    if (editingContent.trim()) {
      await engagement.updateEngagement(engagementId, undefined, editingContent)
      setEditingEngagementId(null)
      setEditingContent('')
    }
  }

  const handleCancelEdit = () => {
    setEditingEngagementId(null)
    setEditingContent('')
  }

  return (
    <div className="mt-8 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Reader Feedback</h3>

      {/* Stats */}
      <div className="rounded-lg bg-blue-50 p-4">
        <p className="text-xs text-gray-600 font-medium">Total Feedback</p>
        <p className="text-3xl font-bold text-blue-600">{engagement.engagements.length}</p>
      </div>

      {/* Engagements List */}
      <div className="space-y-4">
        {engagement.loading ? (
          <p className="text-gray-500 text-sm">Loading feedback...</p>
        ) : engagement.engagements.length === 0 ? (
          <p className="text-gray-500 text-sm">No feedback yet</p>
        ) : (
          engagement.engagements.map((item) => (
            <div key={item.id} className="flex gap-4">
              {/* Emoji - Left side */}
              <div className="shrink-0">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-3xl">
                  {EMOJI_MAP[item.reaction_type as keyof typeof EMOJI_MAP]}
                </div>
              </div>

              {/* Content Box - Middle */}
              <div className="flex-1">
                <div className="rounded-lg border border-gray-300 bg-white p-4 mb-2">
                  {editingEngagementId === item.id ? (
                    <textarea
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                    />
                  ) : (
                    <p className="text-gray-800 text-sm leading-relaxed">{item.content}</p>
                  )}
                </div>

                {/* Delete Button (left) and Date (right) - Below content */}
                <div className="flex items-center justify-between">
                  <div>
                    {editingEngagementId === item.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(item.id)}
                          className="rounded bg-green-100 px-3 py-1 text-xs font-semibold text-green-600 hover:bg-green-200"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="rounded bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-200"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleDeleteEngagement(item.id)}
                        className="rounded bg-[#D42724] px-3 py-1 text-xs font-semibold text-white hover:bg-[#b91f1a]"
                      >
                        Delete Comment
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(item.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
