import { supabase } from '@/supabase/client'

export type WorkLabel = 'Indoor & Studio' | 'Outdoor & Events' | 'Videography'

export interface Work {
  id: string
  main_image_url: string | null
  description: string | null
  label_1: WorkLabel | null
  label_2: WorkLabel | null
  date: string | null
  created_at: string
  updated_at: string
}

export interface WorkMedia {
  id: string
  work_id: string
  image_url: string
  display_order: number
  created_at: string
}

export interface WorkWithMedia extends Work {
  media: WorkMedia[]
}

const TABLE_NAME = 'works_collection'
const MEDIA_TABLE_NAME = 'works_collection_media'
const BUCKET_NAME = 'works-images'

export interface NewWorkInput {
  main_image_url?: string | null
  description?: string | null
  label_1?: WorkLabel | null
  label_2?: WorkLabel | null
  date?: string | null
}

export interface UpdateWorkInput {
  main_image_url?: string | null
  description?: string | null
  label_1?: WorkLabel | null
  label_2?: WorkLabel | null
  date?: string | null
}

export async function fetchAllWorks() {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .order('date', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as Work[]
}

export async function fetchWorkById(id: string) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Work
}

export async function fetchWorkWithMedia(id: string) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select(`
      *,
      media:${MEDIA_TABLE_NAME}(*)
    `)
    .eq('id', id)
    .single()

  if (error) throw error

  const work = data as Work & { media: WorkMedia[] }
  return {
    ...work,
    media: (work.media || []).sort((a, b) => a.display_order - b.display_order),
  } as WorkWithMedia
}

export async function createWork(input: NewWorkInput) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert({
      main_image_url: input.main_image_url ?? null,
      description: input.description ?? null,
      label_1: input.label_1 ?? null,
      label_2: input.label_2 ?? null,
      date: input.date ?? null,
    })
    .select()
    .single()

  if (error) throw error
  return data as Work
}

export async function updateWork(id: string, updates: UpdateWorkInput) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update({
      main_image_url: updates.main_image_url,
      description: updates.description,
      label_1: updates.label_1,
      label_2: updates.label_2,
      date: updates.date,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Work
}

export async function deleteWork(id: string) {
  const { error } = await supabase.from(TABLE_NAME).delete().eq('id', id)
  if (error) throw error
}

// Media functions
export async function fetchWorkMedia(workId: string) {
  const { data, error } = await supabase
    .from(MEDIA_TABLE_NAME)
    .select('*')
    .eq('work_id', workId)
    .order('display_order', { ascending: true })

  if (error) throw error
  return (data ?? []) as WorkMedia[]
}

export async function addWorkMedia(workId: string, imageUrl: string) {
  // Get current max display_order
  const { data: existingMedia } = await supabase
    .from(MEDIA_TABLE_NAME)
    .select('display_order')
    .eq('work_id', workId)
    .order('display_order', { ascending: false })
    .limit(1)
    .single()

  const nextOrder = existingMedia ? existingMedia.display_order + 1 : 0

  const { data, error } = await supabase
    .from(MEDIA_TABLE_NAME)
    .insert({
      work_id: workId,
      image_url: imageUrl,
      display_order: nextOrder,
    })
    .select()
    .single()

  if (error) throw error
  return data as WorkMedia
}

export async function deleteWorkMedia(mediaId: string) {
  const { error } = await supabase.from(MEDIA_TABLE_NAME).delete().eq('id', mediaId)
  if (error) throw error
}

export async function reorderWorkMedia(workId: string, mediaIds: string[]) {
  // Update display_order for all media items
  const updates = mediaIds.map((id, index) => ({
    id,
    display_order: index,
  }))

  for (const update of updates) {
    const { error } = await supabase
      .from(MEDIA_TABLE_NAME)
      .update({ display_order: update.display_order })
      .eq('id', update.id)
      .eq('work_id', workId)

    if (error) throw error
  }
}

// Image upload function
export async function uploadWorkImage(file: File, folder: 'main' | 'gallery' = 'gallery') {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt || 'jpg'}`
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

