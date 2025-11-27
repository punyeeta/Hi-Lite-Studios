import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import {
  fetchPublishedBlogStories,
  fetchBlogStoryById,
  type BlogStory,
} from '@/supabase/supabase_services/Blogs_Stories/Blogs_stories'

interface MagazineState {
  // List view
  items: BlogStory[]
  loading: boolean
  error: string | null
  currentPage: number
  itemsPerPage: number
  totalItems: number

  // Single article view
  articleCache: Map<string, BlogStory>
  articleLoading: boolean

  // Actions
  fetchItems: () => Promise<void>
  fetchArticleById: (id: string) => Promise<BlogStory | null>
  setCurrentPage: (page: number) => void
  clearCache: () => void
}

export const useMagazineStore = create<MagazineState>()(
  devtools((set, get) => ({
    // Initial state
    items: [],
    loading: true,
    error: null,
    currentPage: 1,
    itemsPerPage: 12,
    totalItems: 0,
    articleCache: new Map(),
    articleLoading: false,

    // Fetch all published stories (list view)
    fetchItems: async () => {
      set({ loading: true, error: null })
      try {
        const stories = await fetchPublishedBlogStories()
        set({
          items: stories,
          totalItems: stories.length,
          loading: false,
        })
      } catch (err: any) {
        set({
          error: err.message ?? 'Failed to load items',
          loading: false,
        })
      }
    },

    // Fetch single article with full content (uses cache)
    fetchArticleById: async (id: string) => {
      const { articleCache } = get()

      // Return from cache if available
      if (articleCache.has(id)) {
        return articleCache.get(id) || null
      }

      set({ articleLoading: true })
      try {
        const article = await fetchBlogStoryById(parseInt(id, 10))
        const newCache = new Map(articleCache)
        newCache.set(id, article)
        set({ articleCache: newCache, articleLoading: false })
        return article
      } catch (err) {
        console.error('Error fetching article:', err)
        set({ articleLoading: false })
        return null
      }
    },

    // Pagination
    setCurrentPage: (page: number) => {
      set({ currentPage: page })
    },

    // Clear all cached data
    clearCache: () => {
      set({
        items: [],
        articleCache: new Map(),
        currentPage: 1,
        totalItems: 0,
      })
    },
  })),
)
