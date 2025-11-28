import { useState, useCallback, useEffect } from 'react'
import type { Booking, BookingStatus } from '@/supabase/supabase_services/admin_boooking/bookings'
import { fetchBookingById } from '@/supabase/supabase_services/admin_boooking/bookings'
import PendingIcon from '../../../assets/images/Adminbuttons/bookings_buttons/Pending_Button.png'
import ConfirmedIcon from '../../../assets/images/Adminbuttons/bookings_buttons/ConfirmedButton.png'
import CancelledIcon from '../../../assets/images/Adminbuttons/bookings_buttons/CancellButton.png'
import DeclinedIcon from '../../../assets/images/Adminbuttons/bookings_buttons/Declinebutton.png'
import { useBookings, BOOKING_TABS } from '../../../utils'
import { BookingsTable, BookingsHeader } from '../shared'
import BookingDetailsModal from '../shared/BookingDetailsModal'

type Tab = BookingStatus

// Map icon names to imports (exclude available-dates)
const iconMap: Record<string, string> = {
  'PendingButton.png': PendingIcon,
  'ConfirmedButton.png': ConfirmedIcon,
  'CancellButton.png': CancelledIcon,
  'Declinebutton.png': DeclinedIcon,
}

const TABS = BOOKING_TABS
  .filter((tab) => tab.id !== 'available-dates')
  .map((tab) => ({
    ...tab,
    icon: iconMap[tab.icon] || tab.icon,
  }))

export default function AdminBookings() {
  const [activeTab, setActiveTab] = useState<Tab>('pending')
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [filterDate, setFilterDate] = useState<string>('')

  // Use custom hook for all booking logic
  const { bookings, loading, error, updateStatus, updateManyStatus } = useBookings({ activeTab })
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  const toggleSelectAll = useCallback(() => {
    const allSelected = bookings.length > 0 && selectedIds.length === bookings.length
    if (allSelected) {
      setSelectedIds([])
    } else {
      setSelectedIds(bookings.map((b) => b.id))
    }
  }, [bookings, selectedIds.length])

  const toggleSelect = useCallback((id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }, [])

  const handleStatusChange = useCallback((id: number, status: BookingStatus) => {
    updateStatus(id, status)
    setSelectedIds((prev) => prev.filter((x) => x !== id))
  }, [updateStatus])

  const handleBulkStatusChange = useCallback((status: BookingStatus) => {
    if (!selectedIds.length) return
    updateManyStatus(selectedIds, status)
    setSelectedIds([])
  }, [selectedIds, updateManyStatus])

  const handleApproveSelected = useCallback(() => {
    handleBulkStatusChange('confirmed')
  }, [handleBulkStatusChange])

  const handleDeclineSelected = useCallback(() => {
    handleBulkStatusChange('declined')
  }, [handleBulkStatusChange])

  const handleRowClick = useCallback(async (booking: Booking) => {
    try {
      setDetailsOpen(true)
      // Fetch full details including notes/description
      const full = await fetchBookingById(booking.id)
      setSelectedBooking(full)
    } catch (e) {
      // Fallback to partial booking if fetch fails
      setSelectedBooking(booking)
    }
  }, [])

  const renderStatusBadge = useCallback((status: BookingStatus) => {
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
  }, [])

  // available-dates tab removed — no UI helper needed

  useEffect(() => {
    if (activeTab !== 'confirmed') setFilterDate('')
  }, [activeTab])

  // Apply a client-side date filter when viewing confirmed bookings
  const displayedBookings =
    activeTab === 'confirmed' && filterDate
      ? bookings.filter((b) => {
          try {
            return new Date(b.event_date).toISOString().slice(0, 10) === filterDate
          } catch (e) {
            return false
          }
        })
      : bookings

  return (
    <section className="space-y-6 relative">
      <header className="space-y-3">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
          Booking Appointments
        </h1>
      </header>

      <div className="flex items-center justify-between gap-4">
        <div className="inline-flex p-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as BookingStatus)}
              className={`group px-3 py-2 text-xs font-semibold uppercase tracking-wide rounded-md transition-all duration-200 ease-in-out 
                          ${activeTab === tab.id
                            ? 'bg-[#E2E2E2] text-[#291471] shadow-md scale-105'
                            : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200'
                          }`}
            >
              <span className="flex items-center gap-2">
                <img
                  src={tab.icon}
                  alt={`${tab.label} tab icon`}
                  className={`h-5 w-auto transition-transform duration-200 group-hover:scale-110 group-hover:brightness-110 group-hover:saturate-150`}
                />
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        {activeTab === 'confirmed' ? (
          <div className="flex items-center gap-2">
            <label htmlFor="confirmed-filter-date" className="sr-only">Filter confirmed by date</label>
            <div className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-2 py-1 text-sm shadow-sm">
              <input
                id="confirmed-filter-date"
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
                title="Filter confirmed bookings by date"
              />
              {filterDate && (
                <button
                  type="button"
                  onClick={() => setFilterDate('')}
                  aria-label="Clear date filter"
                  className="ml-2 rounded-md px-2 py-1 text-sm text-gray-600 hover:bg-gray-100"
                >
                  &#x2715;
                </button>
              )}
            </div>
          </div>
        ) : activeTab === 'pending' ? (
          <BookingsHeader
            selectedCount={selectedIds.length}
            loading={loading}
            onApproveSelected={handleApproveSelected}
            onDeclineSelected={handleDeclineSelected}
          />
        ) : null}
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <>
        {activeTab === 'confirmed' && filterDate && !loading && !error && displayedBookings.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-lg text-gray-600">
            <p className="font-semibold mb-2">No booking appointments on this date.</p>
            <p>Try clearing the date filter to see all confirmed bookings.</p>
          </div>
        ) : (
          <>
            <BookingsTable
              bookings={displayedBookings}
              loading={loading}
              error={error}
              selectedIds={selectedIds}
              onSelectAll={toggleSelectAll}
              onSelect={toggleSelect}
              onStatusChange={handleStatusChange}
              renderStatusBadge={renderStatusBadge}
              onRowClick={handleRowClick}
            />

            {displayedBookings.length > 0 && (
              <div className="flex items-center justify-between pt-4 text-s text-[#333333]">
                <span>
                  Showing <strong>{displayedBookings.length}</strong> result
                  {displayedBookings.length !== 1 && 's'}
                </span>
              </div>
            )}

            <BookingDetailsModal
              booking={selectedBooking}
              isOpen={detailsOpen}
              onClose={() => setDetailsOpen(false)}
            />
          </>
        )}
      </>
    </section>
  )
}