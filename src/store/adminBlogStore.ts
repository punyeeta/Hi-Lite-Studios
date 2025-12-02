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
  archiveBlogStory,
  type BlogStory,
  type NewBlogStoryInput,
  type UpdateBlogStoryInput,
} from '@/supabase/supabase_services/Blogs_Stories/Blogs_stories'
import { useMagazineStore } from './magazineStore'

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
  saveDraft: (id: number, updates?: UpdateBlogStoryInput) => Promise<BlogStory | null>
  deleteStory: (id: number) => Promise<boolean>
  togglePin: (id: number, isPinned: boolean) => Promise<boolean>
  archiveStory: (id: number) => Promise<BlogStory | null>
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
        console.error('[AdminBlog] Fetch error:', err)
      }
    },

    // Fetch single story with full content for editing
    fetchStoryById: async (id: number) => {
      // Check cache first
      let currentState: AdminBlogState | undefined
      set((state) => {
        currentState = state
        return state
      })

      if (currentState?.storyCache.has(id)) {
        const cached = currentState.storyCache.get(id)
        return cached || null
      }

      set({ editingLoading: true, editingError: null })
      try {
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
        console.error('[AdminBlog] Fetch single error:', err)
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
        // Sync with magazine store
        useMagazineStore.getState().addItem(newStory)
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
        set((state) => {
          const newCache = new Map(state.storyCache)
          newCache.set(id, updatedStory)
          return {
            stories: state.stories.map((s) => (s.id === id ? updatedStory : s)),
            editingStory: updatedStory,
            saving: false,
            storyCache: newCache,
          }
        })
        // Sync with magazine store
        useMagazineStore.getState().updateItem(id.toString(), updatedStory)
        return updatedStory
      } catch (err: any) {
        set({
          error: err.message ?? 'Failed to update story',
          saving: false,
        })
        return null
      }
    },

    // Save as draft (sets status='draft')
    saveDraft: async (id: number, updates: UpdateBlogStoryInput = {}) => {
      set({ saving: true, error: null })
      try {
        const updatedStory = await updateBlogStory(id, { ...updates, status: 'draft' })
        set((state) => {
          const newCache = new Map(state.storyCache)
          newCache.set(id, updatedStory)
          return {
            stories: state.stories.map((s) => (s.id === id ? updatedStory : s)),
            editingStory: updatedStory,
            saving: false,
            storyCache: newCache,
          }
        })
        useMagazineStore.getState().updateItem(id.toString(), updatedStory)
        return updatedStory
      } catch (err: any) {
        set({
          error: err.message ?? 'Failed to save draft',
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
        // Sync with magazine store and invalidate cache
        useMagazineStore.getState().deleteItem(id.toString())
        return true
      } catch (err: any) {
        set({
          error: err.message ?? 'Failed to delete story',
          saving: false,
        })
        return false
      }
    },

    // Toggle pin status with optimistic update
    togglePin: async (id: number, isPinned: boolean) => {
      set({ error: null })
      
      // Optimistic update: immediately flip the pin status in UI
      set((state) => ({
        stories: state.stories.map((s) => 
          s.id === id ? { ...s, is_pinned: !s.is_pinned } : s
        ),
        editingStory: state.editingStory?.id === id 
          ? { ...state.editingStory, is_pinned: !state.editingStory.is_pinned }
          : state.editingStory,
      }))

      try {
        // Make the API call in the background
        const updatedStory = isPinned
          ? await unpinBlogStory(id)
          : await pinBlogStory(id)

        // Confirm update with server response
        set((state) => ({
          stories: state.stories.map((s) => (s.id === id ? updatedStory : s)),
          editingStory: state.editingStory?.id === id ? updatedStory : state.editingStory,
        }))
        // Sync with magazine store
        useMagazineStore.getState().updateItem(id.toString(), updatedStory)
        return true
      } catch (err: any) {
        // Rollback on error
        set((state) => ({
          stories: state.stories.map((s) => 
            s.id === id ? { ...s, is_pinned: isPinned } : s
          ),
          editingStory: state.editingStory?.id === id 
            ? { ...state.editingStory, is_pinned: isPinned }
            : state.editingStory,
          error: err.message ?? 'Failed to update pin status',
        }))
        return false
      }
    },

    // Archive story (set status to 'archived')
    archiveStory: async (id: number) => {
      set({ saving: true, error: null })
      try {
        const archivedStory = await archiveBlogStory(id)
        set((state) => ({
          stories: state.stories.map((s) => (s.id === id ? archivedStory : s)),
          editingStory: null,
          saving: false,
        }))
        // Sync with magazine store
        useMagazineStore.getState().updateItem(id.toString(), archivedStory)
        return archivedStory
      } catch (err: any) {
        set({
          error: err.message ?? 'Failed to archive story',
          saving: false,
        })
        return null
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
