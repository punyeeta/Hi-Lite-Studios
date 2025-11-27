import { supabase } from '@/supabase/client'

export interface AboutUs {
  id: string
  main_image_url: string | null
  description: string | null
  meet_team_title: string | null
  meet_team_subtitle: string | null
  what_we_do_title: string | null
  what_we_do_description: string | null
  created_at: string
  updated_at: string
}

export interface AboutUsStaff {
  id: string
  about_us_id: string
  name: string
  display_order: number
  created_at: string
}

const TABLE_NAME = 'about_us'
const STAFF_TABLE_NAME = 'about_us_staff'
const BUCKET_NAME = 'about-us-images'

export interface UpdateAboutUsInput {
  main_image_url?: string | null
  description?: string | null
  meet_team_title?: string | null
  meet_team_subtitle?: string | null
  what_we_do_title?: string | null
  what_we_do_description?: string | null
}

export interface NewStaffInput {
  name: string
}

export interface UpdateStaffInput {
  name?: string
  display_order?: number
}

// Fetch or create the single about_us row
export async function fetchAboutUs() {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .limit(1)
    .single()

  if (error) {
    // If no row exists, create a default one
    if (error.code === 'PGRST116') {
      const { data: newData, error: createError } = await supabase
        .from(TABLE_NAME)
        .insert({})
        .select()
        .single()

      if (createError) throw createError
      return newData as AboutUs
    }
    throw error
  }

  return data as AboutUs
}

// Upsert pattern - update if exists, create if not
export async function updateAboutUs(input: UpdateAboutUsInput) {
  // First try to fetch existing
  const existing = await fetchAboutUs().catch(() => null)

  if (existing) {
    // Update existing
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({
        main_image_url: input.main_image_url,
        description: input.description,
        meet_team_title: input.meet_team_title,
        meet_team_subtitle: input.meet_team_subtitle,
        what_we_do_title: input.what_we_do_title,
        what_we_do_description: input.what_we_do_description,
      })
      .eq('id', existing.id)
      .select()
      .single()

    if (error) throw error
    return data as AboutUs
  } else {
    // Create new
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert({
        main_image_url: input.main_image_url ?? null,
        description: input.description ?? null,
        meet_team_title: input.meet_team_title ?? null,
        meet_team_subtitle: input.meet_team_subtitle ?? null,
        what_we_do_title: input.what_we_do_title ?? null,
        what_we_do_description: input.what_we_do_description ?? null,
      })
      .select()
      .single()

    if (error) throw error
    return data as AboutUs
  }
}

// Staff functions
export async function fetchStaff() {
  // Fetch all staff members - don't filter by about_us_id to ensure we get all existing staff
  const { data, error } = await supabase
    .from(STAFF_TABLE_NAME)
    .select('*')
    .order('display_order', { ascending: true })

  if (error) throw error
  return (data ?? []) as AboutUsStaff[]
}

export async function addStaff(input: NewStaffInput) {
  const aboutUs = await fetchAboutUs()

  // Get current max display_order from all staff (not filtered by about_us_id)
  const { data: existingStaff } = await supabase
    .from(STAFF_TABLE_NAME)
    .select('display_order')
    .order('display_order', { ascending: false })
    .limit(1)
    .maybeSingle()

  const nextOrder = existingStaff ? existingStaff.display_order + 1 : 0

  const { data, error } = await supabase
    .from(STAFF_TABLE_NAME)
    .insert({
      about_us_id: aboutUs.id,
      name: input.name,
      display_order: nextOrder,
    })
    .select()
    .single()

  if (error) throw error
  return data as AboutUsStaff
}

export async function updateStaff(id: string, updates: UpdateStaffInput) {
  const { data, error } = await supabase
    .from(STAFF_TABLE_NAME)
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as AboutUsStaff
}

export async function deleteStaff(id: string) {
  const { error } = await supabase.from(STAFF_TABLE_NAME).delete().eq('id', id)
  if (error) throw error
}

export async function reorderStaff(staffIds: string[]) {
  const aboutUs = await fetchAboutUs()

  // Update display_order for all staff items
  const updates = staffIds.map((id, index) => ({
    id,
    display_order: index,
  }))

  for (const update of updates) {
    const { error } = await supabase
      .from(STAFF_TABLE_NAME)
      .update({ display_order: update.display_order })
      .eq('id', update.id)
      .eq('about_us_id', aboutUs.id)

    if (error) throw error
  }
}

// Image upload function
export async function uploadAboutUsImage(file: File) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt || 'jpg'}`
  const filePath = `main/${fileName}`

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

