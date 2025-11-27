import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import {
  fetchAllWorks,
  fetchWorkWithMedia,
  type Work,
  type WorkWithMedia,
} from '@/supabase/supabase_services/Content_Management/WorksCollection_Service/WorksCollection'

interface WorksState {
  // List view
  items: Work[]
  loading: boolean
  error: string | null

  // Single work view
  workCache: Map<string, WorkWithMedia>
  workLoading: boolean

  // Actions
  fetchItems: () => Promise<void>
  fetchWorkById: (id: string) => Promise<WorkWithMedia | null>
  clearCache: () => void
}

export const useWorksStore = create<WorksState>()(
  devtools((set, get) => ({
    // Initial state
    items: [],
    loading: true,
    error: null,
    workCache: new Map(),
    workLoading: false,

    // Fetch all works (list view)
    fetchItems: async () => {
      set({ loading: true, error: null })
      try {
        const works = await fetchAllWorks()
        set({
          items: works,
          loading: false,
        })
      } catch (err: any) {
        set({
          error: err.message ?? 'Failed to load works',
          loading: false,
        })
      }
    },

    // Fetch single work with full media (uses cache)
    fetchWorkById: async (id: string) => {
      const { workCache } = get()

      // Return from cache if available
      if (workCache.has(id)) {
        return workCache.get(id) || null
      }

      set({ workLoading: true })
      try {
        const work = await fetchWorkWithMedia(id)
        const newCache = new Map(workCache)
        newCache.set(id, work)
        set({ workCache: newCache, workLoading: false })
        return work
      } catch (err) {
        console.error('Error fetching work:', err)
        set({ workLoading: false })
        return null
      }
    },

    // Clear all cached data
    clearCache: () => {
      set({
        items: [],
        workCache: new Map(),
        error: null,
      })
    },
  })),
)
