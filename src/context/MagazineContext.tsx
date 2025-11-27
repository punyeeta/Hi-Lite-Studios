import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import {
  fetchPublishedBlogStories,
  createBlogStory,
  updateBlogStory,
  deleteBlogStory,
  type BlogStory,
  type NewBlogStoryInput,
  type UpdateBlogStoryInput,
} from '@/supabase/supabase_services/Blogs_Stories/Blogs_stories'

export type MagazineItem = {
  id: string
  title: string
  image: string
  excerpt: string
  content: string
}

type MagazineContextValue = {
  items: MagazineItem[]
  loading: boolean
  error: string | null
  addItem: (input: Omit<MagazineItem, 'id'>) => Promise<void>
  updateItem: (id: string, input: Partial<Omit<MagazineItem, 'id'>>) => Promise<void>
  deleteItem: (id: string) => Promise<void>
  refreshItems: () => Promise<void>
}

const MagazineContext = createContext<MagazineContextValue | undefined>(undefined)

// Helper function to convert BlogStory to MagazineItem
const blogStoryToMagazineItem = (story: BlogStory): MagazineItem => ({
  id: story.id.toString(),
  title: story.title,
  image: story.cover_image || '',
  excerpt: story.excerpt || '',
  content: story.content,
})

export function MagazineProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<MagazineItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadItems = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const stories = await fetchPublishedBlogStories()
      setItems(stories.map(blogStoryToMagazineItem))
    } catch (err: any) {
      setError(err.message ?? 'Failed to load magazine items')
      console.error('Error loading magazine items:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadItems()
  }, [loadItems])

  const addItem: MagazineContextValue['addItem'] = async (input) => {
    try {
      setError(null)
      const newStory: NewBlogStoryInput = {
        title: input.title,
        slug: input.title
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, ''),
        cover_image: input.image || null,
        excerpt: input.excerpt || null,
        content: input.content,
        status: 'published',
      }
      const created = await createBlogStory(newStory)
      setItems((prev) => [blogStoryToMagazineItem(created), ...prev])
    } catch (err: any) {
      setError(err.message ?? 'Failed to add item')
      throw err
    }
  }

  const updateItem: MagazineContextValue['updateItem'] = async (id, input) => {
    try {
      setError(null)
      const storyId = parseInt(id, 10)
      if (isNaN(storyId)) {
        throw new Error('Invalid item ID')
      }

      const updates: UpdateBlogStoryInput = {}
      if (input.title !== undefined) updates.title = input.title
      if (input.image !== undefined) updates.cover_image = input.image || null
      if (input.excerpt !== undefined) updates.excerpt = input.excerpt || null
      if (input.content !== undefined) updates.content = input.content

      const updated = await updateBlogStory(storyId, updates)
      setItems((prev) =>
        prev.map((item) => (item.id === id ? blogStoryToMagazineItem(updated) : item)),
      )
    } catch (err: any) {
      setError(err.message ?? 'Failed to update item')
      throw err
    }
  }

  const deleteItem: MagazineContextValue['deleteItem'] = async (id) => {
    try {
      setError(null)
      const storyId = parseInt(id, 10)
      if (isNaN(storyId)) {
        throw new Error('Invalid item ID')
      }

      await deleteBlogStory(storyId)
      setItems((prev) => prev.filter((item) => item.id !== id))
    } catch (err: any) {
      setError(err.message ?? 'Failed to delete item')
      throw err
    }
  }

  return (
    <MagazineContext.Provider
      value={{ items, loading, error, addItem, updateItem, deleteItem, refreshItems: loadItems }}
    >
      {children}
    </MagazineContext.Provider>
  )
}

export function useMagazine() {
  const ctx = useContext(MagazineContext)
  if (!ctx) {
    throw new Error('useMagazine must be used within a MagazineProvider')
  }
  return ctx
}


