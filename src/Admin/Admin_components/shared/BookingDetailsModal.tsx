import type { Booking } from '@/supabase/supabase_services/admin_boooking/bookings'

interface BookingDetailsModalProps {
  booking: Booking | null
  isOpen: boolean
  onClose: () => void
  loading?: boolean
}

const FullName = ({ booking }: { booking: Booking }) => (
  <span>
    {[booking.client_first_name, booking.client_middle_initial, booking.client_last_name].filter(Boolean).join(' ')}
  </span>
)

export default function BookingDetailsModal({ booking, isOpen, onClose, loading = false }: BookingDetailsModalProps) {
  if (!isOpen || !booking) return null

  const rows: Array<{ label: string; value: React.ReactNode }> = [
    { label: 'Booking ID', value: String(booking.id).padStart(8, '0') },
    { label: 'Name', value: <FullName booking={booking} /> },
    { label: 'Email', value: booking.email },
    { label: 'Phone', value: booking.phone || '—' },
    { label: 'Type of Inquiry', value: booking.type },
    { label: 'Event Date', value: new Date(booking.event_date).toLocaleDateString() },
    { label: 'Status', value: booking.status },
    { label: 'Created', value: new Date(booking.created_at).toLocaleString() },
    { label: 'Updated', value: new Date(booking.updated_at).toLocaleString() },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {loading ? 'Loading...' : 'Booking Details'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Close
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 rounded-lg bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {rows.map((r) => (
                <div key={r.label} className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
                  <span className="text-sm font-medium text-gray-700">{r.label}</span>
                  <span className="text-sm text-gray-900">{r.value}</span>
                </div>
              ))}
            </div>

            {booking.notes && (
              <div className="mt-6">
                <h3 className="mb-2 text-sm font-semibold text-gray-800">Description</h3>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-800 whitespace-pre-wrap">
                  {booking.notes}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
