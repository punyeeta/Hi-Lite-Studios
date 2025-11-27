import type { Booking, BookingStatus } from '@/supabase/supabase_services/admin_boooking/bookings'
import BookingRow from './BookingRow'

export interface BookingsTableProps {
  bookings: Booking[]
  selectedIds: number[]
  loading?: boolean
  error?: string | null
  onSelectAll: () => void
  onSelect: (id: number) => void
  onStatusChange: (id: number, status: BookingStatus) => Promise<void> | void
  renderStatusBadge: (status: BookingStatus) => React.ReactNode
}

export default function BookingsTable({
  bookings,
  selectedIds,
  loading = false,
  error,
  onSelectAll,
  onSelect,
  onStatusChange,
  renderStatusBadge,
}: BookingsTableProps) {
  const allSelected = bookings.length > 0 && selectedIds.length === bookings.length

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onSelectAll}
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
              // Skeleton loaders
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
              bookings.map((booking) => (
                <BookingRow
                  key={booking.id}
                  booking={booking}
                  isSelected={selectedIds.includes(booking.id)}
                  loading={loading}
                  onSelect={onSelect}
                  onStatusChange={onStatusChange}
                  renderStatusBadge={renderStatusBadge}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {bookings.length > 0 && (
        <div className="flex items-center justify-between pt-4 text-xs text-gray-500">
          <span>
            Showing <strong>{bookings.length}</strong> booking
            {bookings.length !== 1 && 's'}
          </span>
        </div>
      )}
    </div>
  )
}
