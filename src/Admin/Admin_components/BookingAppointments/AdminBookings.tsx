import { useState, useCallback } from 'react'
import type { BookingStatus } from '@/supabase/supabase_services/admin_boooking/bookings'
import PendingIcon from '../../../assets/images/Adminbuttons/bookings_buttons/Pending_Button.png'
import ConfirmedIcon from '../../../assets/images/Adminbuttons/bookings_buttons/ConfirmedButton.png'
import CancelledIcon from '../../../assets/images/Adminbuttons/bookings_buttons/CancellButton.png'
import DeclinedIcon from '../../../assets/images/Adminbuttons/bookings_buttons/Declinebutton.png'
import AvailableDatesIcon from '../../../assets/images/Adminbuttons/bookings_buttons/AvailableDatesButton.png'
import { useBookings, BOOKING_TABS } from '../../../utils'
import { BookingsTable, BookingsHeader } from '../shared'

type Tab = BookingStatus | 'available-dates'

// Map icon names to imports
const iconMap: Record<string, string> = {
  'PendingButton.png': PendingIcon,
  'ConfirmedButton.png': ConfirmedIcon,
  'CancellButton.png': CancelledIcon,
  'Declinebutton.png': DeclinedIcon,
  'AvailableDatesButton.png': AvailableDatesIcon,
}

const TABS = BOOKING_TABS.map((tab) => ({
  ...tab,
  icon: iconMap[tab.icon] || tab.icon,
}))

export default function AdminBookings() {
  const [activeTab, setActiveTab] = useState<Tab>('pending')
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  // Use custom hook for all booking logic
  const { bookings, loading, error, updateStatus, updateManyStatus } = useBookings({ activeTab })

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
          <BookingsHeader
            selectedCount={selectedIds.length}
            loading={loading}
            onApproveSelected={handleApproveSelected}
            onDeclineSelected={handleDeclineSelected}
          />
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
        <>
          <BookingsTable
            bookings={bookings}
            loading={loading}
            error={error}
            selectedIds={selectedIds}
            onSelectAll={toggleSelectAll}
            onSelect={toggleSelect}
            onStatusChange={handleStatusChange}
            renderStatusBadge={renderStatusBadge}
          />

          {bookings.length > 0 && (
            <div className="flex items-center justify-between pt-4 text-xs text-gray-500">
              <span>
                Showing <strong>{bookings.length}</strong> booking
                {bookings.length !== 1 && 's'}
              </span>
            </div>
          )}
        </>
      )}
    </section>
  )
}