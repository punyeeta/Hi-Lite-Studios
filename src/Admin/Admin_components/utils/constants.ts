/**
 * Shared constants for Admin components
 */

import type { BookingStatus } from '@/supabase/supabase_services/admin_boooking/bookings'

export type WorkLabel = 'Indoor & Studio' | 'Outdoor & Events' | 'Videography'

export const WORK_LABEL_OPTIONS: { value: WorkLabel; label: string }[] = [
  { value: 'Indoor & Studio', label: 'Indoor & Studio' },
  { value: 'Outdoor & Events', label: 'Outdoor & Events' },
  { value: 'Videography', label: 'Videography' },
]

export const ADMIN_COLORS = {
  primary: '#291471',
  primaryDark: '#1e0f55',
  danger: '#F2322E',
  dangerDark: '#d51e1a',
}

export const UPLOAD_CONFIG = {
  ACCEPTED_TYPES: 'image/*',
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
}

// Booking-specific constants
export const BOOKING_TABS: { id: BookingStatus | 'available-dates'; label: string; icon: string }[] = [
  { id: 'pending', label: 'Pending', icon: 'PendingButton.png' },
  { id: 'confirmed', label: 'Confirmed', icon: 'ConfirmedButton.png' },
  { id: 'cancelled', label: 'Cancelled', icon: 'CancellButton.png' },
  { id: 'declined', label: 'Declined', icon: 'Declinebutton.png' },
  { id: 'available-dates', label: 'Available Dates', icon: 'AvailableDatesButton.png' },
]

export const BOOKING_STATUS_COLORS: Record<BookingStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-700',
  declined: 'bg-red-100 text-red-800',
}

export const BOOKING_ACTION_COLORS = {
  approve: '#FFC800',
  decline: '#EE0202',
  email: '#FFC800',
  cancel: '#4b5563',
}
