import { memo, useState } from 'react'
import type { Booking, BookingStatus } from '@/supabase/supabase_services/admin_boooking/bookings'
import EmailModal from './EmailModal'
import { sendCustomBookingEmail } from '@/supabase/supabase_services/send_email'

export interface BookingRowProps {
  booking: Booking
  isSelected: boolean
  loading?: boolean
  onSelect: (id: number) => void
  onStatusChange: (id: number, status: BookingStatus) => Promise<void> | void
  renderStatusBadge: (status: BookingStatus) => React.ReactNode
  onRowClick?: (booking: Booking) => void
}

export default memo(function BookingRow({
  booking,
  isSelected,
  loading = false,
  onSelect,
  onStatusChange,
  renderStatusBadge,
  onRowClick,
}: BookingRowProps) {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null) // Track which action is loading
  const [emailError, setEmailError] = useState<string | null>(null)

  const fullName = [
    booking.client_first_name,
    booking.client_middle_initial,
    booking.client_last_name,
  ]
    .filter(Boolean)
    .join(' ')

  const handleSendEmail = async (message: string) => {
    try {
      setEmailError(null)
      await sendCustomBookingEmail(booking.email, booking.client_first_name, message, booking.status)
    } catch (err: any) {
      setEmailError(err.message || 'Failed to send email')
      throw err
    }
  }

  const handleStatusChange = async (status: BookingStatus) => {
    try {
      setActionLoading(status)
      await onStatusChange(booking.id, status)
    } finally {
      setActionLoading(null)
    }
  }

  const clickable = (e: React.MouseEvent) => {
    if (!onRowClick) return
    // Prevent click from selecting text or interacting with inputs
    e.preventDefault()
    onRowClick(booking)
  }

  return (
    <tr className={isSelected ? 'bg-violet-50' : undefined}>
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(booking.id)}
          className="h-4 w-4 rounded border-gray-300 text-[#291471] focus:ring-[#291471]"
        />
      </td>
      <td className="px-4 py-3 text-xs font-mono text-gray-700 cursor-pointer hover:underline" onClick={clickable}>
        {String(booking.id).padStart(8, '0')}
      </td>
      <td className="px-4 py-3 text-sm font-medium text-gray-900 cursor-pointer hover:underline" onClick={clickable}>
        {fullName}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700 cursor-pointer hover:underline" onClick={clickable}>
        {booking.type}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700 cursor-pointer hover:underline" onClick={clickable}>
        {new Date(booking.event_date).toLocaleDateString()}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700 cursor-pointer hover:underline" onClick={clickable}>
        {booking.email}
      </td>
      <td className="px-4 py-3 text-right space-x-2">
        {booking.status === 'pending' ? (
          <>
            <button
              type="button"
              onClick={() => handleStatusChange('confirmed')}
              disabled={loading || actionLoading !== null}
              className="rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-sm hover:opacity-90 disabled:cursor-not-allowed disabled:bg-gray-300"
              style={{ backgroundColor: actionLoading === 'confirmed' ? '#FFD700' : '#FFC800' }}
            >
              {actionLoading === 'confirmed' ? 'Approving...' : 'Approve'}
            </button>
            <button
              type="button"
              onClick={() => handleStatusChange('declined')}
              disabled={loading || actionLoading !== null}
              className="rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-sm hover:opacity-90 disabled:cursor-not-allowed disabled:bg-gray-300"
              style={{ backgroundColor: actionLoading === 'declined' ? '#CC0000' : '#EE0202' }}
            >
              {actionLoading === 'declined' ? 'Declining...' : 'Decline'}
            </button>
          </>
        ) : booking.status === 'confirmed' || booking.status === 'cancelled' || booking.status === 'declined' ? (
          <>
            <button
              type="button"
              onClick={() => setIsEmailModalOpen(true)}
              disabled={actionLoading !== null}
              className="inline-flex items-center rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-sm hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              style={{ backgroundColor: '#FFC800' }}
            >
              Email
            </button>
            {emailError && (
              <div className="text-xs text-red-600 mt-1">
                {emailError}
              </div>
            )}
            {booking.status === 'confirmed' && (
              <button
                type="button"
                onClick={() => handleStatusChange('cancelled')}
                disabled={loading || actionLoading !== null}
                className="rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-sm hover:bg-gray-900 disabled:cursor-not-allowed disabled:bg-gray-300"
                style={{ backgroundColor: actionLoading === 'cancelled' ? '#4a4a4a' : '#333333' }}
              >
                {actionLoading === 'cancelled' ? 'Cancelling...' : 'Cancel'}
              </button>
            )}
          </>
        ) : (
          renderStatusBadge(booking.status)
        )}

        <EmailModal
          booking={booking}
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          onSend={handleSendEmail}
          error={emailError}
          onErrorClear={() => setEmailError(null)}
        />
      </td>
    </tr>
  )
})
