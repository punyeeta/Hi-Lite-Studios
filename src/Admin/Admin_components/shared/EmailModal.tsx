import { useState } from 'react'
import type { Booking } from '@/supabase/supabase_services/admin_boooking/bookings'

interface EmailModalProps {
  booking: Booking
  isOpen: boolean
  onClose: () => void
  onSend: (message: string) => Promise<void>
}

const fullName = (booking: Booking) =>
  [booking.client_first_name, booking.client_middle_initial, booking.client_last_name]
    .filter(Boolean)
    .join(' ')

const getDefaultMessage = (booking: Booking, status: string) => {
  const clientName = booking.client_first_name
  const bookingId = String(booking.id).padStart(8, '0')
  const fullBookingName = fullName(booking)
  const bookingDate = new Date(booking.event_date).toLocaleDateString()
  const bookingType = booking.type

  switch (status) {
    case 'confirmed':
      return `Dear ${clientName},\n\nWe are pleased to confirm your booking appointment with Hi-Lite Studios.\n\nBooking Details:\nBooking ID: ${bookingId}\nName: ${fullBookingName}\nType of Inquiry: ${bookingType}\nDate: ${bookingDate}\n\nThank you for choosing Hi-Lite Studios. We look forward to working with you!\n\nBest regards,\nHi-Lite Studios Team`

    case 'cancelled':
      return `Dear ${clientName},\n\nWe regret to inform you that your booking has been cancelled.\n\nBooking Details:\nBooking ID: ${bookingId}\nName: ${fullBookingName}\nType of Inquiry: ${bookingType}\nDate: ${bookingDate}\n\nReason for Cancellation:\n[Please provide the reason for cancellation]\n\nIf you have any questions or would like to reschedule, please feel free to contact us.\n\nBest regards,\nHi-Lite Studios Team`

    case 'declined':
      return `Dear ${clientName},\n\nThank you for your interest in Hi-Lite Studios. Unfortunately, we are unable to proceed with your booking at this time.\n\nBooking Details:\nBooking ID: ${bookingId}\nName: ${fullBookingName}\nType of Inquiry: ${bookingType}\nDate: ${bookingDate}\n\nReason for Decline:\n[Please provide the reason for declining]\n\nWe appreciate your understanding. If you have any questions, please don't hesitate to reach out to us.\n\nBest regards,\nHi-Lite Studios Team`

    default:
      return `Dear ${clientName},\n\nBooking Details:\nBooking ID: ${bookingId}\nName: ${fullBookingName}\nType of Inquiry: ${bookingType}\nDate: ${bookingDate}`
  }
}

export default function EmailModal({ booking, isOpen, onClose, onSend }: EmailModalProps) {
  const [message, setMessage] = useState(getDefaultMessage(booking, booking.status))
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSend = async () => {
    setSending(true)
    setError(null)
    try {
      await onSend(message)
      setMessage('')
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send email')
    } finally {
      setSending(false)
    }
  }

  if (!isOpen) return null

  const getSubject = () => {
    switch (booking.status) {
      case 'confirmed':
        return 'Booking Confirmation - Hi-Lite Studios'
      case 'cancelled':
        return 'Booking Cancellation - Hi-Lite Studios'
      case 'declined':
        return 'Booking Update - Hi-Lite Studios'
      default:
        return 'Booking Status - Hi-Lite Studios'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Send Email</h2>

        <div className="mb-4 space-y-3 rounded-lg bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">To:</span>
            <span className="text-sm text-gray-900">{booking.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Name:</span>
            <span className="text-sm text-gray-900">{fullName(booking)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <span className="inline-block rounded-full px-3 py-1 text-xs font-medium capitalize">
              {booking.status}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Subject:</span>
            <span className="text-sm text-gray-900">{getSubject()}</span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={14}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-mono focus:border-[#291471] focus:outline-none focus:ring-2 focus:ring-[#291471]/20"
            placeholder="Type your message here..."
          />
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={sending}
            className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={sending || !message.trim()}
            className="rounded-md bg-[#FFC800] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sending ? 'Sending...' : 'Send Email'}
          </button>
        </div>
      </div>
    </div>
  )
}
