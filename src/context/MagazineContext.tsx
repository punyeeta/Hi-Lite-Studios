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
  getItemById: (id: string) => Promise<MagazineItem | null>
  cachedItems: Map<string, MagazineItem>
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
  const [cachedItems] = useState<Map<string, MagazineItem>>(new Map())

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
      cachedItems.delete(id)
    } catch (err: any) {
      setError(err.message ?? 'Failed to delete item')
      throw err
    }
  }

  const getItemById: MagazineContextValue['getItemById'] = async (id) => {
    // Check cache first
    if (cachedItems.has(id)) {
      return cachedItems.get(id) || null
    }

    // Check if already in items list
    const existingItem = items.find((item) => item.id === id)
    if (existingItem && existingItem.content) {
      cachedItems.set(id, existingItem)
      return existingItem
    }

    // Fetch from database
    try {
      const story = await fetchBlogStoryById(parseInt(id, 10))
      const magazineItem = blogStoryToMagazineItem(story)
      cachedItems.set(id, magazineItem)
      return magazineItem
    } catch (err) {
      console.error('Error fetching article:', err)
      return null
    }
  }

  return (
    <MagazineContext.Provider
      value={{ items, loading, error, addItem, updateItem, deleteItem, refreshItems: loadItems, getItemById, cachedItems }}
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


