import { useState, useCallback, useEffect } from 'react'
import type { MagazineEngagement, ReactionType } from '@/supabase/supabase_services/Blogs_Stories/reactions_comments'
import {
  getEngagementsForBlog,
  createEngagement as createEngagementApi,
  deleteEngagement as deleteEngagementApi,
  updateEngagement as updateEngagementApi,
} from '@/supabase/supabase_services/Blogs_Stories/reactions_comments'

export interface UseMagazineEngagementOptions {
  blogStoryId: number
}

export const useMagazineEngagement = ({ blogStoryId }: UseMagazineEngagementOptions) => {
  const [engagements, setEngagements] = useState<MagazineEngagement[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load engagements
  const loadEngagements = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getEngagementsForBlog(blogStoryId)
      setEngagements(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load engagements')
    } finally {
      setLoading(false)
    }
  }, [blogStoryId])

  // Auto-load engagements on mount
  useEffect(() => {
    loadEngagements()
  }, [loadEngagements])

  // Create engagement (emoji + comment)
  const createEngagement = useCallback(
    async (reactionType: ReactionType, content: string) => {
      setError(null)
      try {
        const newEngagement = await createEngagementApi(blogStoryId, reactionType, content)
        if (newEngagement) {
          setEngagements((prev) => [newEngagement, ...prev])
          return newEngagement
        }
      } catch (err: any) {
        setError(err.message || 'Failed to create engagement')
      }
      return null
    },
    [blogStoryId],
  )

  // Delete engagement
  const deleteEngagement = useCallback(
    async (engagementId: number) => {
      setError(null)
      try {
        const success = await deleteEngagementApi(engagementId)
        if (success) {
          setEngagements((prev) => prev.filter((e) => e.id !== engagementId))
          return true
        }
      } catch (err: any) {
        setError(err.message || 'Failed to delete engagement')
      }
      return false
    },
    [],
  )

  // Update engagement
  const updateEngagement = useCallback(
    async (engagementId: number, reactionType?: ReactionType, content?: string) => {
      setError(null)
      try {
        const updated = await updateEngagementApi(engagementId, reactionType, content)
        if (updated) {
          setEngagements((prev) =>
            prev.map((e) => (e.id === engagementId ? updated : e)),
          )
          return updated
        }
      } catch (err: any) {
        setError(err.message || 'Failed to update engagement')
      }
      return null
    },
    [],
  )

  return {
    // State
    engagements,
    loading,
    error,

    // Actions
    loadEngagements,
    createEngagement,
    deleteEngagement,
    updateEngagement,
  }
}
