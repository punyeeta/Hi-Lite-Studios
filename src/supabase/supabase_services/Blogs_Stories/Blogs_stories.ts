import { supabase } from '@/supabase/client'

export type BlogStatus = 'draft' | 'published' | 'archived'

export interface BlogStory {
  id: number
  title: string
  slug: string
  cover_image: string | null
  excerpt: string | null
  content: string
  is_pinned: boolean
  status: BlogStatus
  created_at: string
  updated_at: string
}

const TABLE_NAME = 'blogs_stories'

export interface NewBlogStoryInput {
  title: string
  slug: string
  cover_image?: string | null
  excerpt?: string | null
  content: string
  is_pinned?: boolean
  status?: BlogStatus
}

export interface UpdateBlogStoryInput {
  title?: string
  slug?: string
  cover_image?: string | null
  excerpt?: string | null
  content?: string
  is_pinned?: boolean
  status?: BlogStatus
}

const BUCKET_NAME = 'blog-images'

export async function createBlogStory(input: NewBlogStoryInput) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert({
      title: input.title,
      slug: input.slug,
      cover_image: input.cover_image ?? null,
      excerpt: input.excerpt ?? null,
      content: input.content,
      is_pinned: input.is_pinned ?? false,
      status: input.status ?? 'draft',
    })
    .select()
    .single()

  if (error) throw error
  return data as BlogStory
}

// Lightweight query for admin list view (excludes large content field)
export async function fetchAllBlogStoriesForAdmin() {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('id, title, slug, cover_image, excerpt, is_pinned, status, created_at, updated_at')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) throw error
  // Return with empty content since we don't need it for list views
  // Full content will be fetched when editing
  return (data ?? []).map((story) => ({ ...story, content: '' })) as BlogStory[]
}

// Lightweight query for list views (excludes large content field)
export async function fetchPublishedBlogStories() {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('id, title, slug, cover_image, excerpt, is_pinned, status, created_at, updated_at')
    .eq('status', 'published')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) throw error
  // Return with empty content since we don't need it for list views
  return (data ?? []).map((story) => ({ ...story, content: '' })) as BlogStory[]
}

// Paginated query for list views
export async function fetchPublishedBlogStoriesPaginated(page: number = 1, pageSize: number = 12) {
  const start = (page - 1) * pageSize
  const end = start + pageSize - 1

  const { data, error, count } = await supabase
    .from(TABLE_NAME)
    .select('id, title, slug, cover_image, excerpt, is_pinned, status, created_at, updated_at', { count: 'exact' })
    .eq('status', 'published')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .range(start, end)

  if (error) throw error
  return {
    items: (data ?? []).map((story) => ({ ...story, content: '' })) as BlogStory[],
    total: count ?? 0,
    page,
    pageSize,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  }
}

// Server-side search for published stories
export async function searchPublishedBlogStories(query: string, page: number = 1, pageSize: number = 12) {
  const start = (page - 1) * pageSize
  const end = start + pageSize - 1

  const { data, error, count } = await supabase
    .from(TABLE_NAME)
    .select('id, title, slug, cover_image, excerpt, is_pinned, status, created_at, updated_at', { count: 'exact' })
    .eq('status', 'published')
    .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .range(start, end)

  if (error) throw error
  return {
    items: (data ?? []).map((story) => ({ ...story, content: '' })) as BlogStory[],
    total: count ?? 0,
    page,
    pageSize,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  }
}

export async function fetchBlogStoryById(id: number) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as BlogStory
}

export async function updateBlogStory(id: number, updates: UpdateBlogStoryInput) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as BlogStory
}

export async function deleteBlogStory(id: number) {
  const { error } = await supabase.from(TABLE_NAME).delete().eq('id', id)
  if (error) throw error
}

export async function pinBlogStory(id: number) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update({ is_pinned: true })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as BlogStory
}

export async function unpinBlogStory(id: number) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update({ is_pinned: false })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as BlogStory
}

export async function archiveBlogStory(id: number) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update({ status: 'archived' })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as BlogStory
}

export async function uploadBlogImage(
  file: File,
  folder: 'covers' | 'body' = 'covers',
) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${
    fileExt || 'jpg'
  }`
  const filePath = `${folder}/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (uploadError) throw uploadError

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)

  return {
    path: filePath,
    publicUrl,
  }
}



