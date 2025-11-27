import { useEffect, useMemo, useState } from 'react'
import PendingIcon from '../../../assets/images/Adminbuttons/bookings_buttons/Pending_Button.png'
import ConfirmedIcon from '../../../assets/images/Adminbuttons/bookings_buttons/ConfirmedButton.png'
import CancelledIcon from '../../../assets/images/Adminbuttons/bookings_buttons/CancellButton.png'
import DeclinedIcon from '../../../assets/images/Adminbuttons/bookings_buttons/Declinebutton.png'
import AvailableDatesIcon from '../../../assets/images/Adminbuttons/bookings_buttons/AvailableDatesButton.png'
import type { Booking, BookingStatus } from '@/supabase/supabase_services/admin_boooking/bookings'
import {
  fetchBookingsByStatus,
  updateBookingStatus,
  updateManyBookingStatus,
} from '@/supabase/supabase_services/admin_boooking/bookings'

type Tab = BookingStatus | 'available-dates'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'pending', label: 'Pending', icon: PendingIcon },
  { id: 'confirmed', label: 'Confirmed', icon: ConfirmedIcon },
  { id: 'cancelled', label: 'Cancelled', icon: CancelledIcon },
  { id: 'declined', label: 'Declined', icon: DeclinedIcon },
  { id: 'available-dates', label: 'Available Dates', icon: AvailableDatesIcon },
]

export default function AdminBookings() {
  const [activeTab, setActiveTab] = useState<Tab>('pending')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<number[]>([])

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
          setSelectedIds([])
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

  const allSelected = useMemo(
    () => bookings.length > 0 && selectedIds.length === bookings.length,
    [bookings, selectedIds],
  )

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([])
    } else {
      setSelectedIds(bookings.map((b) => b.id))
    }
  }

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  const handleStatusChange = async (id: number, status: BookingStatus) => {
    try {
      setLoading(true)
      await updateBookingStatus(id, status)
      setBookings((prev) => prev.filter((b) => b.id !== id))
      setSelectedIds((prev) => prev.filter((x) => x !== id))
    } catch (err: any) {
      setError(err.message ?? 'Failed to update booking')
    } finally {
      setLoading(false)
    }
  }

  const handleBulkStatusChange = async (status: BookingStatus) => {
    if (!selectedIds.length) return
    try {
      setLoading(true)
      await updateManyBookingStatus(selectedIds, status)
      setBookings((prev) => prev.filter((b) => !selectedIds.includes(b.id)))
      setSelectedIds([])
    } catch (err: any) {
      setError(err.message ?? 'Failed to update selected bookings')
    } finally {
      setLoading(false)
    }
  }

  const renderStatusBadge = (status: BookingStatus) => {
    const colors: Record<BookingStatus, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-gray-100 text-gray-700',
      declined: 'bg-red-100 text-red-800',
    }

    return (
      <span
        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide ${colors[status]}`}
      >
        {status}
      </span>
    )
  }

  const renderAvailableDates = () => (
    <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-600">
      <p className="font-medium mb-2">Available Dates</p>
      <p>
        This section is reserved for showing open calendar slots or syncing with
        your booking calendar. You can implement it later based on your
        workflow.
      </p>
    </div>
  )

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <p className="text-md font-medium text-[#D42724]">Welcome, Admin.</p>
        <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
          Booking Appointments
        </h1>
      </header>

      <div className="flex items-center justify-between gap-4">
        <div className="inline-flex rounded-full bg-gray-100 p-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wide rounded-md transition ${
                activeTab === tab.id
                  ? 'bg-[#E2E2E2] text-[#291471] shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <span className="flex items-center gap-2">
                <img
                  src={tab.icon}
                  alt={`${tab.label} tab icon`}
                  className="h-5 w-auto"
                />
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        {activeTab !== 'available-dates' && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleBulkStatusChange('confirmed')}
              disabled={!selectedIds.length || loading}
              className="rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              style={{ backgroundColor: !selectedIds.length || loading ? '#cccccc' : '#FFC800' }}
            >
              Approve Selected
            </button>
            <button
              type="button"
              onClick={() => handleBulkStatusChange('declined')}
              disabled={!selectedIds.length || loading}
              className="rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              style={{ backgroundColor: !selectedIds.length || loading ? '#cccccc' : '#EE0202' }}
            >
              Decline Selected
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {activeTab === 'available-dates' ? (
        renderAvailableDates()
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-gray-300 text-[#291471] focus:ring-[#291471]"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Booking ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Type of Inquiry
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Email Address
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {loading && !bookings.length ? (
                // Skeleton loaders for table rows
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={`skeleton-${index}`} className="animate-pulse">
                    <td className="px-4 py-3">
                      <div className="h-4 w-4 rounded border border-gray-300 bg-gray-200" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-20 rounded bg-gray-200" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-32 rounded bg-gray-200" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-24 rounded bg-gray-200" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-24 rounded bg-gray-200" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-40 rounded bg-gray-200" />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <div className="h-7 w-20 rounded-md bg-gray-200" />
                        <div className="h-7 w-20 rounded-md bg-gray-200" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : bookings.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-sm text-gray-500"
                  >
                    No bookings in this status yet.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => {
                  const isSelected = selectedIds.includes(booking.id)
                  const fullName = [
                    booking.client_first_name,
                    booking.client_middle_initial,
                    booking.client_last_name,
                  ]
                    .filter(Boolean)
                    .join(' ')

                  return (
                    <tr
                      key={booking.id}
                      className={isSelected ? 'bg-violet-50' : undefined}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(booking.id)}
                          className="h-4 w-4 rounded border-gray-300 text-[#291471] focus:ring-[#291471]"
                        />
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-gray-700">
                        {String(booking.id).padStart(8, '0')}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {fullName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {booking.type}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {new Date(booking.event_date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {booking.email}
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        {booking.status === 'pending' ? (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                handleStatusChange(booking.id, 'confirmed')
                              }
                              disabled={loading}
                              className="rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-sm hover:opacity-90 disabled:cursor-not-allowed disabled:bg-gray-300"
                              style={{ backgroundColor: '#FFC800' }}
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleStatusChange(booking.id, 'declined')
                              }
                              disabled={loading}
                              className="rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-sm hover:opacity-90 disabled:cursor-not-allowed disabled:bg-gray-300"
                              style={{ backgroundColor: '#EE0202' }}
                            >
                              Decline
                            </button>
                          </>
                        ) : booking.status === 'confirmed' ? (
                          <>
                            <a
                              href="https://mail.google.com"
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-sm hover:opacity-90"
                              style={{ backgroundColor: '#FFC800' }}
                            >
                              Email
                            </a>
                            <button
                              type="button"
                              onClick={() =>
                                handleStatusChange(booking.id, 'cancelled')
                              }
                              disabled={loading}
                              className="rounded-md bg-gray-700 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-sm hover:bg-gray-900 disabled:cursor-not-allowed disabled:bg-gray-300"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          renderStatusBadge(booking.status)
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab !== 'available-dates' && bookings.length > 0 && (
        <div className="flex items-center justify-between pt-4 text-xs text-gray-500">
          <span>
            Showing <strong>{bookings.length}</strong> booking
            {bookings.length !== 1 && 's'}
          </span>
        </div>
      )}
    </section>
  )
}