import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import {
  fetchAllBlogStoriesForAdmin,
  fetchBlogStoryById,
  createBlogStory,
  updateBlogStory,
  deleteBlogStory,
  pinBlogStory,
  unpinBlogStory,
  type BlogStory,
  type NewBlogStoryInput,
  type UpdateBlogStoryInput,
} from '@/supabase/supabase_services/Blogs_Stories/Blogs_stories'

interface AdminBlogState {
  // List view
  stories: BlogStory[]
  loading: boolean
  error: string | null

  // Single article editing
  editingStory: BlogStory | null
  editingLoading: boolean
  editingError: string | null

  // Saving state
  saving: boolean

  // Cache for full content
  storyCache: Map<number, BlogStory>

  // Actions
  fetchStories: () => Promise<void>
  fetchStoryById: (id: number) => Promise<BlogStory | null>
  createStory: (input: NewBlogStoryInput) => Promise<BlogStory | null>
  updateStory: (id: number, updates: UpdateBlogStoryInput) => Promise<BlogStory | null>
  deleteStory: (id: number) => Promise<boolean>
  togglePin: (id: number, isPinned: boolean) => Promise<boolean>
  setEditingStory: (story: BlogStory | null) => void
  clearError: () => void
}

export const useAdminBlogStore = create<AdminBlogState>()(
  devtools((set) => ({
    // Initial state
    stories: [],
    loading: true,
    error: null,
    editingStory: null,
    editingLoading: false,
    editingError: null,
    saving: false,
    storyCache: new Map(),

    // Fetch all stories for admin list
    fetchStories: async () => {
      set({ loading: true, error: null })
      try {
        const stories = await fetchAllBlogStoriesForAdmin()
        set({ stories, loading: false })
      } catch (err: any) {
        set({
          error: err.message ?? 'Failed to load stories',
          loading: false,
        })
      }
    },

    // Fetch single story with full content for editing
    fetchStoryById: async (id: number) => {
      // Get current state to check cache first
      let currentState: AdminBlogState | undefined
      set((state) => {
        currentState = state
        return state
      })

      // Check cache first - return immediately without showing loading state
      if (currentState?.storyCache.has(id)) {
        const cached = currentState.storyCache.get(id)
        set({ editingStory: cached || null })
        return cached || null
      }

      set({ editingLoading: true, editingError: null })
      try {
        // If not cached, fetch from database
        const story = await fetchBlogStoryById(id)
        set((state) => {
          const newCache = new Map(state.storyCache)
          newCache.set(id, story)
          return {
            editingStory: story,
            editingLoading: false,
            storyCache: newCache,
          }
        })
        return story
      } catch (err: any) {
        set({
          editingError: err.message ?? 'Failed to load story',
          editingLoading: false,
        })
        return null
      }
    },

    // Create new story
    createStory: async (input: NewBlogStoryInput) => {
      set({ saving: true, error: null })
      try {
        const newStory = await createBlogStory(input)
        set((state) => ({
          stories: [newStory, ...state.stories],
          saving: false,
        }))
        return newStory
      } catch (err: any) {
        set({
          error: err.message ?? 'Failed to create story',
          saving: false,
        })
        return null
      }
    },

    // Update story
    updateStory: async (id: number, updates: UpdateBlogStoryInput) => {
      set({ saving: true, error: null })
      try {
        const updatedStory = await updateBlogStory(id, updates)
        set((state) => ({
          stories: state.stories.map((s) => (s.id === id ? updatedStory : s)),
          editingStory: updatedStory,
          saving: false,
        }))
        return updatedStory
      } catch (err: any) {
        set({
          error: err.message ?? 'Failed to update story',
          saving: false,
        })
        return null
      }
    },

    // Delete story
    deleteStory: async (id: number) => {
      set({ saving: true, error: null })
      try {
        await deleteBlogStory(id)
        set((state) => ({
          stories: state.stories.filter((s) => s.id !== id),
          editingStory: null,
          saving: false,
        }))
        return true
      } catch (err: any) {
        set({
          error: err.message ?? 'Failed to delete story',
          saving: false,
        })
        return false
      }
    },

    // Toggle pin status
    togglePin: async (id: number, isPinned: boolean) => {
      set({ saving: true, error: null })
      try {
        const updatedStory = isPinned
          ? await unpinBlogStory(id)
          : await pinBlogStory(id)

        set((state) => ({
          stories: state.stories.map((s) => (s.id === id ? updatedStory : s)),
          editingStory: state.editingStory?.id === id ? updatedStory : state.editingStory,
          saving: false,
        }))
        return true
      } catch (err: any) {
        set({
          error: err.message ?? 'Failed to update pin status',
          saving: false,
        })
        return false
      }
    },

    // Set story being edited
    setEditingStory: (story: BlogStory | null) => {
      set({ editingStory: story, editingError: null })
    },

    // Clear errors
    clearError: () => {
      set({ error: null, editingError: null })
    },
  })),
)
