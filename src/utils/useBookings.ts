import { useEffect, useState } from 'react'
import type { Booking, BookingStatus } from '@/supabase/supabase_services/admin_boooking/bookings'
import {
  fetchBookingsByStatus,
  updateBookingStatus,
  updateManyBookingStatus,
} from '@/supabase/supabase_services/admin_boooking/bookings'

interface UseBookingsOptions {
  activeTab: BookingStatus | 'available-dates'
}

export type { UseBookingsOptions }

export function useBookings({ activeTab }: UseBookingsOptions) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (activeTab === 'available-dates') {
      setBookings([])
      return
    }

    let cancelled = false
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchBookingsByStatus(activeTab)
        if (!cancelled) {
          setBookings(data)
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message ?? 'Failed to load bookings')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()

    return () => {
      cancelled = true
    }
  }, [activeTab])

  const updateStatus = async (id: number, status: BookingStatus) => {
    try {
      // Remove from UI immediately (optimistic update)
      setBookings((prev) => prev.filter((b) => b.id !== id))
      
      // Update in background without blocking UI
      await updateBookingStatus(id, status)
    } catch (err: any) {
      setError(err.message ?? 'Failed to update booking')
      // Optionally reload on error to sync state
    }
  }

  const updateManyStatus = async (ids: number[], status: BookingStatus) => {
    if (!ids.length) return
    try {
      // Remove from UI immediately (optimistic update)
      setBookings((prev) => prev.filter((b) => !ids.includes(b.id)))
      
      // Update in background without blocking UI
      await updateManyBookingStatus(ids, status)
    } catch (err: any) {
      setError(err.message ?? 'Failed to update selected bookings')
      // Optionally reload on error to sync state
    }
  }

  return {
    bookings,
    loading,
    error,
    setError,
    setBookings,
    updateStatus,
    updateManyStatus,
  }
}
