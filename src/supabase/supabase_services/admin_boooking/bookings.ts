import { supabase } from '@/supabase/client'

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'declined'

export interface Booking {
  id: number
  client_first_name: string
  client_last_name: string
  client_middle_initial: string | null
  email: string
  phone: string | null
  type: string
  event_date: string // ISO date (YYYY-MM-DD) from Supabase
  notes: string | null
  status: BookingStatus
  created_at: string
  updated_at: string
}

const TABLE_NAME = 'bookings'

export interface NewBookingInput {
  client_first_name: string
  client_last_name: string
  client_middle_initial?: string | null
  email: string
  phone?: string | null
  type: string
  event_date: string // YYYY-MM-DD
  notes?: string | null
}

export async function createBooking(input: NewBookingInput) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert({
      client_first_name: input.client_first_name,
      client_last_name: input.client_last_name,
      client_middle_initial: input.client_middle_initial ?? null,
      email: input.email,
      phone: input.phone ?? null,
      type: input.type,
      event_date: input.event_date,
      notes: input.notes ?? null,
    })
    .select()
    .single()

  if (error) throw error
  return data as Booking
}

// Optimized query - excludes notes field for list views (can be large)
export async function fetchBookingsByStatus(status: BookingStatus) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('id, client_first_name, client_last_name, client_middle_initial, email, phone, type, event_date, status, created_at, updated_at')
    .eq('status', status)
    .order('created_at', { ascending: false })

  if (error) throw error
  // Return with null notes since we don't need it for list views
  return (data ?? []).map((booking) => ({ ...booking, notes: null })) as Booking[]
}

export async function updateBookingStatus(id: number, status: BookingStatus) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Booking
}

export async function updateManyBookingStatus(ids: number[], status: BookingStatus) {
  if (!ids.length) return []

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update({ status })
    .in('id', ids)
    .select()

  if (error) throw error
  return (data ?? []) as Booking[]
}

// Fetch full booking by id (includes notes/description and all fields)
export async function fetchBookingById(id: number) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Booking
}

