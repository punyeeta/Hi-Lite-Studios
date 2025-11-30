import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import {
  fetchPublishedBlogStoriesPaginated,
  searchPublishedBlogStories,
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
  totalPages: number
  searchQuery: string

  // Single article view
  articleCache: Map<string, BlogStory>
  articleLoading: boolean

  // Actions
  fetchItems: (page?: number) => Promise<void>
  searchItems: (query: string, page?: number) => Promise<void>
  fetchArticleById: (id: string) => Promise<BlogStory | null>
  setCurrentPage: (page: number) => void
  setSearchQuery: (query: string) => void
  clearCache: () => void
  invalidateArticleCache: (id?: string) => void
  addItem: (story: BlogStory) => void
  updateItem: (id: string, story: BlogStory) => void
  deleteItem: (id: string) => void
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
    totalPages: 0,
    searchQuery: '',
    articleCache: new Map(),
    articleLoading: false,

    // Fetch all published stories (paginated)
    fetchItems: async (page = 1) => {
      set({ loading: true, error: null, searchQuery: '' })
      try {
        const result = await fetchPublishedBlogStoriesPaginated(page, 12)
        set({
          items: result.items,
          totalItems: result.total,
          totalPages: result.totalPages,
          currentPage: page,
          loading: false,
        })
      } catch (err: any) {
        set({
          error: err.message ?? 'Failed to load items',
          loading: false,
        })
      }
    },

    // Search stories
    searchItems: async (query: string, page = 1) => {
      set({ loading: true, error: null, searchQuery: query })
      try {
        const result = await searchPublishedBlogStories(query, page, 12)
        set({
          items: result.items,
          totalItems: result.total,
          totalPages: result.totalPages,
          currentPage: page,
          loading: false,
        })
      } catch (err: any) {
        set({
          error: err.message ?? 'Failed to search items',
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
      const { searchQuery } = get()
      if (searchQuery) {
        get().searchItems(searchQuery, page)
      } else {
        get().fetchItems(page)
      }
    },

    // Set search query
    setSearchQuery: (query: string) => {
      if (query.trim()) {
        get().searchItems(query, 1)
      } else {
        get().fetchItems(1)
      }
    },

    // Invalidate specific article or all articles
    invalidateArticleCache: (id?: string) => {
      set((state) => {
        if (id) {
          const newCache = new Map(state.articleCache)
          newCache.delete(id)
          return { articleCache: newCache }
        }
        return { articleCache: new Map() }
      })
    },

    // Add new item to list
    addItem: (story: BlogStory) => {
      set((state) => ({
        items: [story, ...state.items],
        totalItems: state.totalItems + 1,
      }))
    },

    // Update item in list
    updateItem: (id: string, story: BlogStory) => {
      set((state) => ({
        items: state.items.map((item) => (item.id.toString() === id ? story : item)),
      }))
      // Invalidate cache for this article
      get().invalidateArticleCache(id)
    },

    // Delete item from list
    deleteItem: (id: string) => {
      set((state) => ({
        items: state.items.filter((item) => item.id.toString() !== id),
        totalItems: state.totalItems - 1,
      }))
      // Invalidate cache for this article
      get().invalidateArticleCache(id)
    },

    // Clear all cached data
    clearCache: () => {
      set({
        items: [],
        articleCache: new Map(),
        currentPage: 1,
        totalItems: 0,
        totalPages: 0,
        searchQuery: '',
      })
    },
  })),
)
