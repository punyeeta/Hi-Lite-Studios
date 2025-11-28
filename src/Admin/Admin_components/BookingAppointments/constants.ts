/**
 * BookingAppointments Color Constants
 */
export const BOOKING_COLORS = {
  PRIMARY_PURPLE: '#291471',
  LIGHT_GRAY_BG: '#E2E2E2',
  TEXT_DARK: '#333333',
  PRIMARY_RED: '#F2322E',
  DARK_RED: '#AA1815',
} as const

/**
 * BookingAppointments Error Messages
 */
export const BOOKING_ERRORS = {
  UPDATE_BOOKING: 'Failed to update booking',
  UPDATE_MANY: 'Failed to update selected bookings',
  FETCH_BOOKING: 'Failed to load booking details',
  FETCH_BOOKINGS: 'Failed to load bookings',
} as const

/**
 * BookingAppointments UI Labels
 */
export const BOOKING_LABELS = {
  NO_RESULTS: 'No booking appointments on this date.',
  CLEAR_FILTER: 'Try clearing the date filter to see all confirmed bookings.',
  RESULT_COUNT: 'Showing',
  RESULT_PLURAL: 'results',
  RESULT_SINGULAR: 'result',
} as const
