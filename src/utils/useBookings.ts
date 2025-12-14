import { useEffect, useState } from 'react'
import type { Booking, BookingStatus } from '@/supabase/supabase_services/admin_boooking/bookings'
import {
  fetchBookingsByStatus,
  updateBookingStatus,
  updateManyBookingStatus,
  deleteBooking,
  deleteManyBookings,
} from '@/supabase/supabase_services/admin_boooking/bookings'

interface UseBookingsOptions {
  activeTab: BookingStatus | 'available-dates'
  filterDate?: string
}

export type { UseBookingsOptions }

export function useBookings({ activeTab, filterDate }: UseBookingsOptions) {
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
        const data = await fetchBookingsByStatus(activeTab, filterDate)
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
  }, [activeTab, filterDate])

  const updateStatus = async (id: number, status: BookingStatus) => {
    try {
      // Remove from UI immediately (optimistic update)
      setBookings((prev) => prev.filter((b) => b.id !== id))
      
      // Update in database
      await updateBookingStatus(id, status)
      
      // Refetch to ensure UI is in sync
      const updated = await fetchBookingsByStatus(activeTab as BookingStatus, filterDate)
      setBookings(updated)
    } catch (err: any) {
      setError(err.message ?? 'Failed to update booking')
      // Reload on error to sync state
      const updated = await fetchBookingsByStatus(activeTab as BookingStatus, filterDate)
      setBookings(updated)
    }
  }

  const updateManyStatus = async (ids: number[], status: BookingStatus) => {
    if (!ids.length) return
    try {
      // Remove from UI immediately (optimistic update)
      setBookings((prev) => prev.filter((b) => !ids.includes(b.id)))
      
      // Update in database
      await updateManyBookingStatus(ids, status)
      
      // Refetch to ensure UI is in sync
      const updated = await fetchBookingsByStatus(activeTab as BookingStatus, filterDate)
      setBookings(updated)
    } catch (err: any) {
      setError(err.message ?? 'Failed to update selected bookings')
      // Reload on error to sync state
      const updated = await fetchBookingsByStatus(activeTab as BookingStatus, filterDate)
      setBookings(updated)
    }
  }

  const deleteBookingById = async (id: number) => {
    try {
      // Remove from UI immediately (optimistic update)
      setBookings((prev) => prev.filter((b) => b.id !== id))
      
      // Delete in database
      await deleteBooking(id)
      
      // Refetch to ensure UI is in sync
      const updated = await fetchBookingsByStatus(activeTab as BookingStatus, filterDate)
      setBookings(updated)
    } catch (err: any) {
      setError(err.message ?? 'Failed to delete booking')
      // Reload on error to sync state
      const updated = await fetchBookingsByStatus(activeTab as BookingStatus, filterDate)
      setBookings(updated)
    }
  }

  const deleteMany = async (ids: number[]) => {
    if (!ids.length) return
    try {
      // Remove from UI immediately (optimistic update)
      setBookings((prev) => prev.filter((b) => !ids.includes(b.id)))
      
      // Delete in database
      await deleteManyBookings(ids)
      
      // Refetch to ensure UI is in sync
      const updated = await fetchBookingsByStatus(activeTab as BookingStatus, filterDate)
      setBookings(updated)
    } catch (err: any) {
      setError(err.message ?? 'Failed to delete selected bookings')
      // Reload on error to sync state
      const updated = await fetchBookingsByStatus(activeTab as BookingStatus, filterDate)
      setBookings(updated)
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
    deleteBooking: deleteBookingById,
    deleteMany,
  }
}
