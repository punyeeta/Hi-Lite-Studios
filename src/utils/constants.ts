/**
 * Shared constants for Admin components
 */

import type { BookingStatus } from '@/supabase/supabase_services/admin_boooking/bookings'
import IndoorIcon from '@/assets/images/ServiceIndoor.png'
import OutdoorIcon from '@/assets/images/ServiceOutdoor.png'
import VideoIcon from '@/assets/images/ServiceVid.png'

export type WorkLabel = 'Indoor & Studio' | 'Outdoor & Events' | 'Videography'

export const WORK_LABEL_OPTIONS: { value: WorkLabel; label: string }[] = [
  { value: 'Indoor & Studio', label: 'Indoor & Studio' },
  { value: 'Outdoor & Events', label: 'Outdoor & Events' },
  { value: 'Videography', label: 'Videography' },
]

// Services data - shared across Service.tsx and ServicesSection.tsx
export type ServiceCard = {
  id: string
  title: string
  description: string
  icon: string
  gradient: string
  features: string[]
  textColor: string
}

export const SERVICES_DATA: ServiceCard[] = [
  {
    id: 'indoor',
    title: 'Indoor & Studio Photography',
    description:
      'Professional portraits, family photos, and academic photography in a controlled studio environment.',
    icon: IndoorIcon,
    gradient: 'from-[#4E26D7] to-[#291471]',
    textColor: 'text-[#291471]',
    features: [
      'Individual Portraits',
      'Family/Group Portraits',
      'Graduation Academic Portraits',
      'Fashion/Editorial Shoots',
    ],
  },
  {
    id: 'outdoor',
    title: 'Outdoor & Event Photography',
    description:
      'Coverage of school activities, institutional events, and milestone celebrations with a natural and candid touch.',
    icon: OutdoorIcon,
    gradient: 'from-[#FBC93D] to-[#FF8000]',
    textColor: 'text-[#FF8000]',
    features: [
      'School Event Coverage',
      'Institutional/Corp. Events',
      'Birthday/Milestone Celeb.',
      'Outdoor Portrait Sessions',
      'Organizational Shoots',
      'Engagement/Pre-Event Shoots',
    ],
  },
  {
    id: 'video',
    title: 'Videography',
    description:
      'High-quality event videography for schools, organizations, and personal events to complement our photography services.',
    icon: VideoIcon,
    gradient: 'from-[#F2322E] to-[#AA1815]',
    textColor: 'text-[#AA1815]',
    features: [
      'Event Highlight Videos',
      'Full Event Coverage',
      'Video Documentation for School Events',
    ],
  },
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
