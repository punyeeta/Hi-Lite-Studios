import { supabase } from '@/supabase/client'

export interface FAQ {
  id: string
  question: string
  answer: string
  created_at: string
  updated_at: string
}

const TABLE_NAME = 'faqs'

export interface NewFAQInput {
  question: string
  answer: string
}

export interface UpdateFAQInput {
  question?: string
  answer?: string
}

export async function fetchAllFAQs() {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as FAQ[]
}

export async function createFAQ(input: NewFAQInput) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert({
      question: input.question,
      answer: input.answer,
    })
    .select()
    .single()

  if (error) throw error
  return data as FAQ
}

export async function updateFAQ(id: string, updates: UpdateFAQInput) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as FAQ
}

export async function deleteFAQ(id: string) {
  const { error } = await supabase.from(TABLE_NAME).delete().eq('id', id)
  if (error) throw error
}

