import { memo } from 'react'
import type { Booking, BookingStatus } from '@/supabase/supabase_services/admin_boooking/bookings'

export interface BookingRowProps {
  booking: Booking
  isSelected: boolean
  loading?: boolean
  onSelect: (id: number) => void
  onStatusChange: (id: number, status: BookingStatus) => Promise<void> | void
  renderStatusBadge: (status: BookingStatus) => React.ReactNode
}

export default memo(function BookingRow({
  booking,
  isSelected,
  loading = false,
  onSelect,
  onStatusChange,
  renderStatusBadge,
}: BookingRowProps) {
  const fullName = [
    booking.client_first_name,
    booking.client_middle_initial,
    booking.client_last_name,
  ]
    .filter(Boolean)
    .join(' ')

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
              onClick={() => onStatusChange(booking.id, 'confirmed')}
              disabled={loading}
              className="rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-sm hover:opacity-90 disabled:cursor-not-allowed disabled:bg-gray-300"
              style={{ backgroundColor: '#FFC800' }}
            >
              Approve
            </button>
            <button
              type="button"
              onClick={() => onStatusChange(booking.id, 'declined')}
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
              onClick={() => onStatusChange(booking.id, 'cancelled')}
              disabled={loading}
              className="rounded-md bg-gray-700 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-sm hover:bg-gray-900 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Cancel
            </button>
          </>
        ) : booking.status === 'cancelled' || booking.status === 'declined' ? (
          <button
            type="button"
            onClick={() => window.open(`mailto:${booking.email}`)}
            className="rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-sm hover:opacity-90"
            style={{ backgroundColor: '#FFC800' }}
          >
            Send Email
          </button>
        ) : (
          renderStatusBadge(booking.status)
        )}
      </td>
    </tr>
  )
})
