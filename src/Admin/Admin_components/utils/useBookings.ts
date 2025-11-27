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
      setLoading(true)
      await updateBookingStatus(id, status)
      setBookings((prev) => prev.filter((b) => b.id !== id))
    } catch (err: any) {
      setError(err.message ?? 'Failed to update booking')
    } finally {
      setLoading(false)
    }
  }

  const updateManyStatus = async (ids: number[], status: BookingStatus) => {
    if (!ids.length) return
    try {
      setLoading(true)
      await updateManyBookingStatus(ids, status)
      setBookings((prev) => prev.filter((b) => !ids.includes(b.id)))
    } catch (err: any) {
      setError(err.message ?? 'Failed to update selected bookings')
    } finally {
      setLoading(false)
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
